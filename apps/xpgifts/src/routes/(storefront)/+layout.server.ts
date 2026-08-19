import { getCategories } from "$lib/data/categories";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ platform }) => {
	return { categories: await getCategories(platform?.env) };
};
