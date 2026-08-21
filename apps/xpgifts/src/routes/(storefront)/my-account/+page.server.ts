import { redirect } from "@sveltejs/kit";
import { getAddresses } from "$lib/data/addresses";
import { getOrders } from "$lib/data/orders";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) redirect(303, "/login");

	const orders = await getOrders(platform?.env, locals.user.id);
	return {
		recentOrders: orders.slice(0, 3),
		addressCount: getAddresses().length,
	};
};
