import type { WcEnv } from "./woocommerce";

export type SessionUser = {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
};

export const SESSION_TTL = 60 * 60 * 24; // 24h - keep in sync with the cookie's maxAge in +page.server.ts.
const VERIFY_TTL = 60 * 60 * 24; // 24h link expiry.

export type LoginResult =
	| { status: "ok"; token: string; user: SessionUser }
	| { status: "unverified" }
	| { status: "invalid" };

export type RegisterResult =
	| { status: "pending-verification"; email: string }
	| { status: "error"; error: string };

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

async function createSession(
	env: Pick<WcEnv, "XPGIFTS">,
	user: SessionUser,
): Promise<string | null> {
	try {
		const token = crypto.randomUUID();
		await env.XPGIFTS.put(`session:${token}`, JSON.stringify(user), {
			expirationTtl: SESSION_TTL,
		});
		return token;
	} catch {
		return null;
	}
}

type WcCustomer = {
	id: number;
	email: string;
	username?: string;
	first_name?: string;
	last_name?: string;
	meta_data?: { key: string; value: unknown }[];
};

// Verification status is tracked as WC customer meta (`email_verified`), set
// once the confirmation link is clicked - see verifyEmailToken(). Absence of
// the meta key (e.g. a customer created before this feature existed, or one
// that never verified) is treated as unverified.
function isVerified(customer: Pick<WcCustomer, "meta_data">): boolean {
	return (
		customer.meta_data?.some(
			(meta) => meta.key === "email_verified" && meta.value === "yes",
		) ?? false
	);
}

async function findCustomerByEmail(
	env: WcEnv,
	email: string,
): Promise<WcCustomer | null> {
	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(
		new URL(
			`/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`,
			env.WC_STORE_URL,
		),
		{
			headers: {
				Authorization: `Basic ${credentials}`,
				"User-Agent": "XP-RAY",
			},
		},
	);
	if (!response.ok) return null;
	const customers = (await response.json()) as WcCustomer[];
	return customers[0] ?? null;
}

async function getCustomerById(
	env: WcEnv,
	customerId: number,
): Promise<WcCustomer | null> {
	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(
		new URL(`/wp-json/wc/v3/customers/${customerId}`, env.WC_STORE_URL),
		{
			headers: {
				Authorization: `Basic ${credentials}`,
				"User-Agent": "XP-RAY",
			},
		},
	);
	if (!response.ok) return null;
	return (await response.json()) as WcCustomer;
}

async function sendVerificationEmail(
	env: WcEnv,
	customerId: number,
	firstname: string,
	lastname: string,
	email: string,
	origin: string,
): Promise<void> {
	const token = crypto.randomUUID();
	await env.XPGIFTS.put(`verify:${token}`, JSON.stringify({ customerId }), {
		expirationTtl: VERIFY_TTL,
	});

	const verifyUrl = `${origin}/verify-email?token=${token}`;
	const safeName = escapeHtml(`${firstname} ${lastname}`);
	await env.EMAIL.send({
		to: { email, name: `${firstname} ${lastname}` },
		from: { email: "noreply@xpgifts.com", name: "xpgifts" },
		subject: "Confirm your xpgifts account",
		html: `<p>Hi ${safeName},</p><p>Thanks for creating an xpgifts account. Please confirm your email address to activate it:</p><p><a href="${verifyUrl}">Confirm your email</a></p><p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>`,
		text: `Hi ${firstname} ${lastname},\n\nThanks for creating an xpgifts account. Please confirm your email address to activate it:\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create this account, you can ignore this email.`,
	});
}

// Store-specific customer login - not part of stock WooCommerce REST API v3,
// same custom "xp/" namespace as WcTopic's /xp/topics endpoint (see
// woocommerce.ts). The store has no JWT auth plugin installed (confirmed via
// GET /wp-json/ root discovery - no jwt-auth/v1 namespace), so this hits
// xpgifts' own POST /wc/v3/xp/authorize endpoint instead.
//
// Request body is {u, p: password}; on success the response body is
// {id, firstname, lastname} (id numeric) - confirmed. There's no bearer
// token in the response, so we mint our own opaque session token and own
// the session lifecycle entirely via KV, keyed by that token.
//
// Verification status still requires a separate customer lookup (WC customer
// meta_data isn't part of this response), which doubles as the "does this
// account exist" check.
export async function loginCustomer(
	env: WcEnv,
	email: string,
	password: string,
): Promise<LoginResult> {
	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(
		new URL("/wp-json/wc/v3/xp/authorize", env.WC_STORE_URL),
		{
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/json",
				"User-Agent": "XP-RAY",
			},
			body: JSON.stringify({ u: email, p: password }),
		},
	);
	if (!response.ok) return { status: "invalid" };

	const data = (await response.json()) as {
		id: number;
		firstname: string;
		lastname: string;
		verified: string;
	};

	console.log("loginCustomer response data:", data);
	if (!data.id) return { status: "invalid" };

	if (data.verified !== "yes") return { status: "unverified" };

	const user: SessionUser = {
		id: String(data.id),
		firstname: data.firstname,
		lastname: data.lastname,
		email,
	};

	const token = await createSession(env, user);
	if (!token) return { status: "invalid" };
	return { status: "ok", token, user };
}

// Standard, documented WooCommerce REST API v3 endpoint (unlike xp/authorize
// above) - POST /wc/v3/customers, requiring only `email`. Confirmed against
// the real store's GET /wp-json/ discovery response (full arg schema, no
// guessing needed here). Doesn't log the customer in - an unverified account
// can't authenticate (see isVerified()) until they click the confirmation
// link sent here, which verifyEmailToken() handles.
export async function registerCustomer(
	env: WcEnv,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	origin: string,
): Promise<RegisterResult> {
	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(
		new URL("/wp-json/wc/v3/customers", env.WC_STORE_URL),
		{
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/json",
				"User-Agent": "XP-RAY",
			},
			body: JSON.stringify({
				email,
				password,
				first_name: firstName,
				last_name: lastName,
			}),
		},
	);

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as {
			message?: string;
		} | null;
		return {
			status: "error",
			error:
				body?.message ?? "Could not create your account. Please try again.",
		};
	}

	const customer = (await response.json()) as { id: number };
	await sendVerificationEmail(
		env,
		customer.id,
		firstName,
		lastName,
		email,
		origin,
	);

	return { status: "pending-verification", email };
}

// Marks the WC customer verified (meta_data.email_verified = "yes") and logs
// them straight in. Tokens are single-use (deleted immediately) and expire
// after VERIFY_TTL.
export async function verifyEmailToken(
	env: WcEnv,
	token: string,
): Promise<LoginResult> {
	const record = await env.XPGIFTS.get<{ customerId: number }>(
		`verify:${token}`,
		"json",
	);
	if (!record) return { status: "invalid" };
	await env.XPGIFTS.delete(`verify:${token}`);

	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(
		new URL(`/wp-json/wc/v3/customers/${record.customerId}`, env.WC_STORE_URL),
		{
			method: "PUT",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/json",
				"User-Agent": "XP-RAY",
			},
			body: JSON.stringify({
				meta_data: [{ key: "email_verified", value: "yes" }],
			}),
		},
	);
	if (!response.ok) return { status: "invalid" };

	const customer = (await response.json()) as WcCustomer;
	const user: SessionUser = {
		id: String(customer.id),
		firstname: customer.first_name ?? "",
		lastname: customer.last_name ?? "",
		email: customer.email,
	};

	const sessionToken = await createSession(env, user);
	if (!sessionToken) return { status: "invalid" };
	return { status: "ok", token: sessionToken, user };
}

// Silently no-ops if the email doesn't match an account or is already
// verified, rather than reporting which - callers should always show the
// same generic "if that account needs verification, we've sent a link"
// message regardless of outcome, to avoid leaking account existence.
export async function resendVerificationEmail(
	env: WcEnv,
	email: string,
	origin: string,
): Promise<void> {
	const customer = await findCustomerByEmail(env, email);
	if (!customer) return;
	if (isVerified(customer)) return;

	await sendVerificationEmail(
		env,
		customer.id,
		customer.first_name ?? "",
		customer.last_name ?? "",
		customer.email,
		origin,
	);
}

export async function resolveSession(
	env: Pick<WcEnv, "XPGIFTS">,
	token: string,
): Promise<SessionUser | null> {
	return env.XPGIFTS.get<SessionUser>(`session:${token}`, "json");
}

export async function endSession(
	env: Pick<WcEnv, "XPGIFTS">,
	token: string,
): Promise<void> {
	await env.XPGIFTS.delete(`session:${token}`);
}
