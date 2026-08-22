import { redirect } from "@sveltejs/kit";
import { getCountries } from "$lib/data/countries";
import { getCustomerAddresses } from "$lib/data/customerAddresses";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) redirect(303, "/login");
	const [addresses, countries] = await Promise.all([
		getCustomerAddresses(platform?.env, locals.user.id),
		getCountries(platform?.env),
	]);
	// Addresses store the country as an ISO code (e.g. "US") - look up the
	// display name for this read-only summary rather than showing the raw
	// code (the edit forms show the code as the <select> value instead).
	const countryName = (code: string) =>
		countries.find((country) => country.code === code)?.name ?? code;
	return {
		addresses: {
			billing: {
				...addresses.billing,
				country: countryName(addresses.billing.country),
			},
			shipping: {
				...addresses.shipping,
				country: countryName(addresses.shipping.country),
			},
		},
	};
};
