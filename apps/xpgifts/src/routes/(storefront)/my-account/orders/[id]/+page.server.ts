import { error, redirect } from "@sveltejs/kit";
import { getOrderById } from "$lib/data/orders";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ params, platform, locals }) => {
	if (!locals.user) redirect(303, "/login");

	const order = await getOrderById(platform?.env, locals.user.id, params.id);
	if (!order) error(404, "Order not found");
	return { order };
};
