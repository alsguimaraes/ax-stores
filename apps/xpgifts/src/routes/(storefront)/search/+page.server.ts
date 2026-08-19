import { searchProducts } from "$lib/data/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, platform }) => {
	const query = url.searchParams.get("q") ?? "";
	const page = Number(url.searchParams.get("page") ?? "1") || 1;
	const result = await searchProducts(platform?.env, query, page);
	return {
		query,
		results: result.items,
		page: result.page,
		totalPages: result.totalPages,
	};
};
