import { error } from "@sveltejs/kit";
import { getProductsByTheme } from "$lib/data/products";
import { getThemeBySlug } from "$lib/data/themes";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url, platform }) => {
	const theme = await getThemeBySlug(platform?.env, params.slug);
	if (!theme) error(404, "Theme not found");
	const page = Number(url.searchParams.get("page") ?? "1") || 1;
	const result = await getProductsByTheme(platform?.env, params.slug, page);
	return {
		theme,
		products: result.items,
		page: result.page,
		totalPages: result.totalPages,
	};
};
