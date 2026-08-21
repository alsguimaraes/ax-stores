import { redirect } from "@sveltejs/kit";
import { getOrders } from "$lib/data/orders";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads. The extra
// check is just to satisfy the type (SessionUser | null) and fail safely if
// that guard is ever bypassed, rather than querying WooCommerce with a
// meaningless customer id.
export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) redirect(303, "/login");

	const orders = await getOrders(platform?.env, locals.user.id);
	return { orders };
};
