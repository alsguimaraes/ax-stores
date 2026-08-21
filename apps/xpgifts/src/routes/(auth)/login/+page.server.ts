import { fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import {
	loginCustomer,
	resendVerificationEmail,
	SESSION_TTL,
} from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions } from "./$types";

// SvelteKit forbids mixing a `default` action with named actions in the same
// file - this must be named (not `default`) because `resend` also lives
// here. See login/+page.svelte's form action="?/login".
export const actions: Actions = {
	login: async ({ request, cookies, platform, url }) => {
		const data = await request.formData();
		const email = String(data.get("email") ?? "").trim();
		const password = String(data.get("password") ?? "");

		if (!email || !password) {
			return fail(400, {
				error: "Enter your email and password.",
				email,
				unverified: false,
			});
		}
		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
				error: "Login is unavailable right now.",
				email,
				unverified: false,
			});
		}

		const result = await loginCustomer(platform.env, email, password);
		if (result.status === "unverified") {
			return fail(400, {
				error:
					"Please verify your email before logging in - check your inbox for the confirmation link.",
				email,
				unverified: true,
			});
		}
		if (result.status !== "ok") {
			return fail(400, {
				error: "Incorrect email or password.",
				email,
				unverified: false,
			});
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

	resend: async ({ request, platform, url }) => {
		const data = await request.formData();
		const email = String(data.get("email") ?? "").trim();

		if (email && isWcConfigured(platform?.env)) {
			await resendVerificationEmail(platform.env, email, url.origin);
		}

		return { resent: true, email };
	},
};
