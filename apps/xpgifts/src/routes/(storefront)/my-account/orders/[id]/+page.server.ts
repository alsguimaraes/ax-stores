import { error, redirect } from "@sveltejs/kit";
import { getOrderById } from "$lib/data/orders";
import { getProductsByIds } from "$lib/data/products";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = async ({ params, platform, locals }) => {
	if (!locals.user) redirect(303, "/login");

	const order = await getOrderById(platform?.env, locals.user.id, params.id);
	if (!order) error(404, "Order not found");

	// One batched request (WC's `include` filter) instead of one per line
	// item - see getProductsByIds.
	const productIds = [
		...new Set(
			order.items
				.map((item) => item.productId)
				.filter((id): id is string => Boolean(id)),
		),
	];
	const products = await getProductsByIds(platform?.env, productIds);
	const productsById = new Map(
		products.map((product) => [product.id, product]),
	);

	const items = order.items.map((item) => {
		const product = item.productId
			? productsById.get(item.productId)
			: undefined;
		return {
			...item,
			productSlug: item.productSlug ?? product?.slug,
			image: product?.images[0],
			sku: product?.sku,
		};
	});

	return { order: { ...order, items } };
};
