import { fail, redirect } from "@sveltejs/kit";
import { getCustomerAddresses } from "$lib/data/customerAddresses";
import { updateCustomerAddress } from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions, PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) redirect(303, "/login");
	return {
		addresses: await getCustomerAddresses(platform?.env, locals.user.id),
	};
};

const EMPTY_VALUES = {
	firstName: "",
	lastName: "",
	company: "",
	line1: "",
	line2: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
	phone: "",
	email: "",
};

function readAddressForm(data: FormData) {
	return {
		firstName: String(data.get("firstName") ?? "").trim(),
		lastName: String(data.get("lastName") ?? "").trim(),
		company: String(data.get("company") ?? "").trim(),
		line1: String(data.get("line1") ?? "").trim(),
		line2: String(data.get("line2") ?? "").trim(),
		city: String(data.get("city") ?? "").trim(),
		state: String(data.get("state") ?? "").trim(),
		postalCode: String(data.get("postalCode") ?? "").trim(),
		country: String(data.get("country") ?? "").trim(),
		phone: String(data.get("phone") ?? "").trim(),
		email: String(data.get("email") ?? "").trim(),
	};
}

function validateAddress(
	values: ReturnType<typeof readAddressForm>,
	requireEmail: boolean,
): string | undefined {
	if (
		!values.firstName ||
		!values.lastName ||
		!values.line1 ||
		!values.city ||
		!values.state ||
		!values.postalCode ||
		!values.country
	) {
		return "Please fill in all required fields.";
	}
	if (requireEmail) {
		if (!values.email) return "Email is required.";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			return "Enter a valid email address.";
		}
	}
	return undefined;
}

export const actions: Actions = {
	billing: async ({ request, platform, locals }) => {
		// my-account/+layout.server.ts already redirects logged-out visitors
		// away before this route renders, so locals.user is always set here -
		// this check is just defense in depth against calling the action
		// directly.
		if (!locals.user) {
			return fail(401, {
				type: "billing" as const,
				error: "You must be logged in.",
				values: EMPTY_VALUES,
			});
		}

		const values = readAddressForm(await request.formData());
		const error = validateAddress(values, true);
		if (error) return fail(400, { type: "billing" as const, error, values });

		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
				type: "billing" as const,
				error: "Address updates are unavailable right now.",
				values,
			});
		}

		const result = await updateCustomerAddress(
			platform.env,
			locals.user.id,
			"billing",
			{
				first_name: values.firstName,
				last_name: values.lastName,
				company: values.company,
				address_1: values.line1,
				address_2: values.line2,
				city: values.city,
				state: values.state,
				postcode: values.postalCode,
				country: values.country,
				phone: values.phone,
				email: values.email,
			},
		);
		if (result.status === "error") {
			return fail(400, {
				type: "billing" as const,
				error: result.error,
				values,
			});
		}

		return { type: "billing" as const, success: true, values };
	},

	shipping: async ({ request, platform, locals }) => {
		if (!locals.user) {
			return fail(401, {
				type: "shipping" as const,
				error: "You must be logged in.",
				values: EMPTY_VALUES,
			});
		}

		const values = readAddressForm(await request.formData());
		const error = validateAddress(values, false);
		if (error) return fail(400, { type: "shipping" as const, error, values });

		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
				type: "shipping" as const,
				error: "Address updates are unavailable right now.",
				values,
			});
		}

		const result = await updateCustomerAddress(
			platform.env,
			locals.user.id,
			"shipping",
			{
				first_name: values.firstName,
				last_name: values.lastName,
				company: values.company,
				address_1: values.line1,
				address_2: values.line2,
				city: values.city,
				state: values.state,
				postcode: values.postalCode,
				country: values.country,
				phone: values.phone,
			},
		);
		if (result.status === "error") {
			return fail(400, {
				type: "shipping" as const,
				error: result.error,
				values,
			});
		}

		return { type: "shipping" as const, success: true, values };
	},
};
