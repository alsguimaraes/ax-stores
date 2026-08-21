import { redirect } from "@sveltejs/kit";
import { getCustomerAddresses } from "$lib/data/customerAddresses";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) redirect(303, "/login");
	return {
		addresses: await getCustomerAddresses(platform?.env, locals.user.id),
	};
};
