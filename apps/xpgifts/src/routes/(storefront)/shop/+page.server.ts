import { getProducts } from "$lib/data/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, platform }) => {
	const page = Number(url.searchParams.get("page") ?? "1") || 1;
	const result = await getProducts(platform?.env, page);
	return {
		products: result.items,
		page: result.page,
		totalPages: result.totalPages,
	};
};
