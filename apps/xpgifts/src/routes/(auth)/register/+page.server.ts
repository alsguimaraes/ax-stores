import { fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { registerCustomer, SESSION_TTL } from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request, cookies, platform, url }) => {
		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const password = String(data.get("password") ?? "");

		if (!name || !email || !password) {
			return fail(400, {
				error: "Fill in your name, email, and password.",
				name,
				email,
			});
		}
		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
				error: "Registration is unavailable right now.",
				name,
				email,
			});
		}

		const result = await registerCustomer(platform.env, name, email, password);
		if ("error" in result) {
			return fail(400, { error: result.error, name, email });
		}

		cookies.set("session", result.token, {
			path: "/",
			httpOnly: true,
			secure: !dev,
			sameSite: "lax",
			maxAge: SESSION_TTL,
		});

		redirect(303, url.searchParams.get("redirectTo") || "/my-account");
	},
};
