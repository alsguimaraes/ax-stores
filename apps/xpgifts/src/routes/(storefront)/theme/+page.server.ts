import { getThemes } from "$lib/data/themes";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, platform }) => {
	const page = Number(url.searchParams.get("page") ?? "1") || 1;
	const result = await getThemes(platform?.env, page);
	return {
		themes: result.items,
		page: result.page,
		totalPages: result.totalPages,
	};
};
