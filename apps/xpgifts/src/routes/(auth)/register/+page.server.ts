import { fail } from "@sveltejs/kit";
import { registerCustomer } from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request, platform, url }) => {
		const data = await request.formData();
		const firstName = String(data.get("firstName") ?? "").trim();
		const lastName = String(data.get("lastName") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const confirmEmail = String(data.get("confirmEmail") ?? "").trim();
		const password = String(data.get("password") ?? "");

		if (!firstName || !lastName || !email || !confirmEmail || !password) {
			return fail(400, {
				error: "Fill in your first name, last name, email, and password.",
				firstName,
				lastName,
				email,
			});
		}
		if (email !== confirmEmail) {
			return fail(400, {
				error: "Emails do not match.",
				firstName,
				lastName,
				email,
			});
		}
		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
				error: "Registration is unavailable right now.",
				firstName,
				lastName,
				email,
			});
		}

		const result = await registerCustomer(
			platform.env,
			firstName,
			lastName,
			email,
			password,
			url.origin,
		);
		if (result.status === "error") {
			return fail(400, { error: result.error, firstName, lastName, email });
		}

		return { pendingVerification: true, email: result.email };
	},
};
