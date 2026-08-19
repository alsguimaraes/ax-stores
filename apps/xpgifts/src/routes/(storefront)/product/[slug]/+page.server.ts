import { error } from "@sveltejs/kit";
import { getCategoryBySlug } from "$lib/data/categories";
import { getProductBySlug, getRelatedProducts } from "$lib/data/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
	const product = await getProductBySlug(platform?.env, params.slug);
	if (!product) error(404, "Product not found");
	return {
		product,
		category: await getCategoryBySlug(platform?.env, product.categorySlug),
		related: await getRelatedProducts(platform?.env, product),
	};
};
