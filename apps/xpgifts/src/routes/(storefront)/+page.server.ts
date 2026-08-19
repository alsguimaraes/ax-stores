import { getCategories } from "$lib/data/categories";
import { getFeaturedProducts } from "$lib/data/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
	return {
		featuredProducts: await getFeaturedProducts(platform?.env, 8),
		categories: await getCategories(platform?.env),
	};
};
