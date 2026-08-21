import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { SESSION_TTL, verifyEmailToken } from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, cookies, platform }) => {
	const token = url.searchParams.get("token");
	if (!token || !isWcConfigured(platform?.env)) {
		return { verified: false };
	}

	const result = await verifyEmailToken(platform.env, token);
	if (result.status !== "ok") {
		return { verified: false };
	}

	cookies.set("session", result.token, {
		path: "/",
		httpOnly: true,
		secure: !dev,
		sameSite: "lax",
		maxAge: SESSION_TTL,
	});

	redirect(303, "/my-account");
};
