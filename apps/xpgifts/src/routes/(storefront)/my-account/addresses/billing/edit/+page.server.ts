import { fail, redirect } from "@sveltejs/kit";
import { getCustomerAddresses } from "$lib/data/customerAddresses";
import {
	EMPTY_ADDRESS_VALUES,
	readAddressForm,
	validateAddress,
} from "$lib/server/addressForm";
import { updateCustomerAddress } from "$lib/server/auth";
import { isWcConfigured } from "$lib/server/woocommerce";
import type { Actions, PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) redirect(303, "/login");
	const addresses = await getCustomerAddresses(platform?.env, locals.user.id);
	return { address: addresses.billing };
};

export const actions: Actions = {
	default: async ({ request, platform, locals }) => {
		// my-account/+layout.server.ts already redirects logged-out visitors
		// away before this route renders, so locals.user is always set here -
		// this check is just defense in depth against calling the action
		// directly.
		if (!locals.user) {
			return fail(401, {
				error: "You must be logged in.",
				values: EMPTY_ADDRESS_VALUES,
			});
		}

		const values = readAddressForm(await request.formData());
		const error = validateAddress(values, true);
		if (error) return fail(400, { error, values });

		if (!isWcConfigured(platform?.env)) {
			return fail(500, {
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
			return fail(400, { error: result.error, values });
		}

		return { success: true, values };
	},
};
