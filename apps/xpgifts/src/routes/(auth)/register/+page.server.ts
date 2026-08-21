import { fail } from "@sveltejs/kit";
import { registerCustomer } from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request, platform, url }) => {
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

		const result = await registerCustomer(
			platform.env,
			name,
			email,
			password,
			url.origin,
		);
		if (result.status === "error") {
			return fail(400, { error: result.error, name, email });
		}

		return { pendingVerification: true, email: result.email };
	},
};
