import { getCategories } from "$lib/data/categories";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ platform, request }) => {
	const accept = request.headers.get("accept") ?? "";
	return {
		categories: await getCategories(platform?.env),
		supportsWebp: accept.includes("image/webp"),
	};
};
