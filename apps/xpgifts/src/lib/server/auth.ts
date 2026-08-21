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

export type UpdateProfileResult =
	| { status: "ok"; user: SessionUser }
	| { status: "error"; error: string };

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

async function writeSession(
	env: Pick<WcEnv, "XPGIFTS">,
	token: string,
	user: SessionUser,
): Promise<boolean> {
	try {
		await env.XPGIFTS.put(`session:${token}`, JSON.stringify(user), {
			expirationTtl: SESSION_TTL,
		});
		return true;
	} catch {
		return false;
	}
}

async function createSession(
	env: Pick<WcEnv, "XPGIFTS">,
	user: SessionUser,
): Promise<string | null> {
	const token = crypto.randomUUID();
	return (await writeSession(env, token, user)) ? token : null;
}

// Overwrites an EXISTING session's stored data in place (same token/cookie),
// used after a profile update so the change is reflected without forcing a
// re-login.
export async function updateSession(
	env: Pick<WcEnv, "XPGIFTS">,
	token: string,
	user: SessionUser,
): Promise<boolean> {
	return writeSession(env, token, user);
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
			(meta) => meta.key === "email_verified" && meta.value === "yes" || meta.key === "last_login",
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
// {id, firstname, lastname, verified} (id numeric) - confirmed via a direct API test.
// There's no bearer token in the xp/authorize response either, so we mint our own
// opaque session token and own the session lifecycle entirely via KV, keyed
// by that token.
export async function loginCustomer(
	env: WcEnv,
	email: string,
	password: string,
): Promise<LoginResult> {
	console.log(`[login] authorize: attempting for ${email}`);
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
	console.log(`[login] authorize: HTTP ${response.status}`);
	if (!response.ok) {
		console.log(`[login] authorize: rejected, body=${await response.text()}`);
		return { status: "invalid" };
	}

	const data = (await response.json()) as {
		id: number;
		firstname: string;
		lastname: string;
		verified: string;
	};
	console.log(`[login] authorize: response=${JSON.stringify(data)}`);
	if (!data.id) {
		console.log("[login] authorize: no id in response, treating as invalid");
		return { status: "invalid" };
	}

	const verified = data.verified === "yes";
	console.log(`[login] verification check: verified=${verified}`);
	if (!verified) return { status: "unverified" };

	const user: SessionUser = {
		id: String(data.id),
		firstname: data.firstname,
		lastname: data.lastname,
		email,
	};

	const token = await createSession(env, user);
	console.log(`[login] session: created=${!!token}`);
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

// PUT /wc/v3/customers/{id} - same documented endpoint as registerCustomer's
// POST, supporting the same writable fields. Email is intentionally not
// updatable here (that's the account's login identity, not a plain profile
// field) - only name and, optionally, password. `password` is omitted from
// the request body entirely when not provided, since WC would otherwise
// treat an empty string as "set the password to empty" rather than "leave
// it unchanged".
export async function updateCustomerProfile(
	env: WcEnv,
	customerId: string,
	firstName: string,
	lastName: string,
	password: string,
): Promise<UpdateProfileResult> {
	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const body: { first_name: string; last_name: string; password?: string } = {
		first_name: firstName,
		last_name: lastName,
	};
	if (password) body.password = password;

	const response = await fetch(
		new URL(`/wp-json/wc/v3/customers/${customerId}`, env.WC_STORE_URL),
		{
			method: "PUT",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/json",
				"User-Agent": "XP-RAY",
			},
			body: JSON.stringify(body),
		},
	);

	if (!response.ok) {
		const errBody = (await response.json().catch(() => null)) as {
			message?: string;
		} | null;
		return {
			status: "error",
			error:
				errBody?.message ?? "Could not update your profile. Please try again.",
		};
	}

	const customer = (await response.json()) as WcCustomer;
	const user: SessionUser = {
		id: String(customer.id),
		firstname: customer.first_name ?? "",
		lastname: customer.last_name ?? "",
		email: customer.email,
	};
	return { status: "ok", user };
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
