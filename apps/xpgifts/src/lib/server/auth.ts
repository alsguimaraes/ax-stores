import type { WcEnv } from "./woocommerce";

export type SessionUser = {
	id: string;
	name: string;
	email: string;
};

export const SESSION_TTL = 60 * 60 * 24; // 24h - keep in sync with the cookie's maxAge in +page.server.ts.

// Store-specific customer login - not part of stock WooCommerce REST API v3,
// same custom "xp/" namespace as WcTopic's /xp/topics endpoint (see
// woocommerce.ts). The store has no JWT auth plugin installed (confirmed via
// GET /wp-json/ root discovery - no jwt-auth/v1 namespace), so this hits
// xpgifts' own POST /wc/v3/xp/authorize endpoint instead.
//
// Request body is {u: username/email, p: password}; on success the response
// body is {id, name} (id numeric) - confirmed. There's no bearer token in the
// response, so we mint our own opaque session token and own the session
// lifecycle entirely via KV, keyed by that token.
export async function loginCustomer(
	env: WcEnv,
	email: string,
	password: string,
): Promise<{ token: string; user: SessionUser } | null> {
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
	if (!response.ok) {
		console.log(
			`loginCustomer(${email}): rejected by backend, HTTP ${response.status}`,
		);
		return null;
	}

	const data = (await response.json()) as { id: number; name: string };
	if (!data.id || !data.name) {
		console.log(
			`loginCustomer(${email}): unexpected response shape ${JSON.stringify(data)}`,
		);
		return null;
	}

	const user: SessionUser = {
		id: String(data.id),
		name: data.name,
		email,
	};

	try {
		const token = crypto.randomUUID();
		await env.XPGIFTS.put(`session:${token}`, JSON.stringify(user), {
			expirationTtl: SESSION_TTL,
		});
		console.log(
			`loginCustomer(${email}): success, session stored for id=${user.id}`,
		);
		return { token, user };
	} catch (err) {
		console.log(`loginCustomer(${email}): KV session write failed - ${err}`);
		return null;
	}
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
