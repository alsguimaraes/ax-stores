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
//
// The endpoint double-encodes its JSON response (the body is itself a JSON
// string containing the {id, name} JSON, rather than the object directly -
// likely a `json_encode()` on the WP side being passed to `rest_ensure_response()`,
// which encodes it again) - response.json() below unwraps that extra layer.
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
		return null;
	}

	const data = (await response.json()) as { id: number; name: string };
	if (!data.id || !data.name) {
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
		return { token, user };
	} catch {
		return null;
	}
}

// Standard, documented WooCommerce REST API v3 endpoint (unlike xp/authorize
// above) - POST /wc/v3/customers, requiring only `email`. Confirmed against
// the real store's GET /wp-json/ discovery response (full arg schema, no
// guessing needed here). On success, logs the new customer straight in via
// loginCustomer() so registration behaves like login+redirect.
export async function registerCustomer(
	env: WcEnv,
	name: string,
	email: string,
	password: string,
): Promise<{ token: string; user: SessionUser } | { error: string }> {
	const [firstName, ...rest] = name.trim().split(/\s+/);
	const lastName = rest.join(" ");

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
			error:
				body?.message ?? "Could not create your account. Please try again.",
		};
	}

	const result = await loginCustomer(env, email, password);
	if (!result) {
		return { error: "Account created - please log in." };
	}
	return result;
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
