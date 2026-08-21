import { fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import {
	loginCustomer,
	resendVerificationEmail,
	SESSION_TTL,
} from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request, cookies, platform, url }) => {
		console.log("[login action] step 1: received form submission");
		const data = await request.formData();
		const email = String(data.get("email") ?? "").trim();
		const password = String(data.get("password") ?? "");
		console.log(
			`[login action] step 2: parsed email=${email} passwordLength=${password.length}`,
		);

		if (!email || !password) {
			console.log("[login action] step 2 FAILED: missing email or password");
			return fail(400, { error: "Enter your email and password.", email });
		}
		const wcConfigured = isWcConfigured(platform?.env);
		console.log(`[login action] step 3: isWcConfigured=${wcConfigured}`);
		if (!wcConfigured) {
			console.log("[login action] step 3 FAILED: WooCommerce not configured");
			return fail(500, { error: "Login is unavailable right now.", email });
		}

		console.log("[login action] step 4: calling loginCustomer()");
		const result = await loginCustomer(platform.env, email, password);
		console.log(
			`[login action] step 5: loginCustomer() result status=${result.status}`,
		);

		if (result.status === "unverified") {
			console.log("[login action] step 5 FAILED: account not verified");
			return fail(400, {
				error:
					"Please verify your email before logging in - check your inbox for the confirmation link.",
				email,
				unverified: true,
			});
		}
		if (result.status !== "ok") {
			console.log("[login action] step 5 FAILED: invalid credentials");
			return fail(400, { error: "Incorrect email or password.", email });
		}

		console.log(
			`[login action] step 6: setting session cookie, secure=${!dev}`,
		);
		cookies.set("session", result.token, {
			path: "/",
			httpOnly: true,
			secure: !dev,
			sameSite: "lax",
			maxAge: SESSION_TTL,
		});

		const redirectTo = url.searchParams.get("redirectTo") || "/my-account";
		console.log(`[login action] step 7: redirecting to ${redirectTo}`);
		redirect(303, redirectTo);
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
