import { fail } from "@sveltejs/kit";
import {
	updateCustomerProfile,
	updateSession,
	verifyPassword,
} from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request, cookies, platform, locals }) => {
		// my-account/+layout.server.ts already redirects logged-out visitors
		// away before this route renders, so locals.user is always set here -
		// this check is just defense in depth against calling the action
		// directly.
		if (!locals.user) {
			return fail(401, {
				error: "You must be logged in.",
				firstName: "",
				lastName: "",
			});
		}

		const data = await request.formData();
		const firstName = String(data.get("firstName") ?? "").trim();
		const lastName = String(data.get("lastName") ?? "").trim();
		const currentPassword = String(data.get("currentPassword") ?? "");
		const password = String(data.get("password") ?? "");
		const confirmPassword = String(data.get("confirmPassword") ?? "");
		const changingPassword = Boolean(
			currentPassword || password || confirmPassword,
		);

		if (!firstName || !lastName) {
			return fail(400, {
				error: "First and last name are required.",
				firstName,
				lastName,
			});
		}
		if (changingPassword) {
			if (!currentPassword || !password || !confirmPassword) {
				return fail(400, {
					error:
						"Enter your current password and the new password twice to change it.",
					firstName,
					lastName,
				});
			}
			if (password !== confirmPassword) {
				return fail(400, {
					error: "New passwords do not match.",
					firstName,
					lastName,
				});
			}
		}
		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
				error: "Profile updates are unavailable right now.",
				firstName,
				lastName,
			});
		}

		if (changingPassword) {
			// Requiring the current password stops someone with just a
			// stolen/active session cookie from silently taking over the
			// account by changing its password.
			const currentPasswordValid = await verifyPassword(
				platform.env,
				locals.user.email,
				currentPassword,
			);
			if (!currentPasswordValid) {
				return fail(400, {
					error: "Current password is incorrect.",
					firstName,
					lastName,
				});
			}
		}

		const result = await updateCustomerProfile(
			platform.env,
			locals.user.id,
			firstName,
			lastName,
			changingPassword ? password : "",
		);
		if (result.status === "error") {
			return fail(400, { error: result.error, firstName, lastName });
		}

		const token = cookies.get("session");
		if (token) {
			await updateSession(platform.env, token, result.user);
		}

		return { success: true, firstName, lastName };
	},
};
