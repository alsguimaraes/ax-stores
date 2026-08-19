import { error } from "@sveltejs/kit";
import { getOrderById } from "$lib/data/orders";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	const order = getOrderById(params.id);
	if (!order) error(404, "Order not found");
	return { order };
};
