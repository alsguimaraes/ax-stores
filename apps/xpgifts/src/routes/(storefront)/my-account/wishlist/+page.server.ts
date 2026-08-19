import { getProductBySlug } from "$lib/data/products";
import { getWishlistProductSlugs } from "$lib/data/wishlist";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
	const products = await Promise.all(
		getWishlistProductSlugs().map((slug) =>
			getProductBySlug(platform?.env, slug),
		),
	);
	return { products: products.filter((product) => product !== undefined) };
};
