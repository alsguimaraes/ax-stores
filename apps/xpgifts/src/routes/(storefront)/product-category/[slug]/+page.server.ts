import { error } from "@sveltejs/kit";
import {
	getCategoryBySlug,
	getChildCategories,
	getOtherCategories,
} from "$lib/data/categories";
import { getProductsByCategory } from "$lib/data/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url, platform }) => {
	const page = Number(url.searchParams.get("page") ?? "1") || 1;

	// "other" isn't a real WooCommerce category — it's the catch-all nav entry
	// (see getCategories()) linking to every top-level category not featured
	// in the header. Reuses this page's existing "children grid" rendering.
	if (params.slug === "other") {
		const result = await getOtherCategories(platform?.env, page);
		return {
			category: {
				id: 0,
				parentId: 0,
				slug: "other",
				name: "Other Categories",
				description: "Browse all our other gift categories.",
				image: "",
			},
			children: result.items,
			products: [],
			page: result.page,
			totalPages: result.totalPages,
		};
	}

	const category = await getCategoryBySlug(platform?.env, params.slug);
	if (!category) error(404, "Category not found");

	// Query children unpaginated first (page 1) just to know whether this is a
	// hub (has subcategories) or a leaf (lists products) — then fetch the
	// requested page of whichever list is actually active.
	const firstChildPage = await getChildCategories(
		platform?.env,
		category.id,
		1,
	);
	if (firstChildPage.items.length === 0) {
		const products = await getProductsByCategory(
			platform?.env,
			category.slug,
			page,
		);
		return {
			category,
			children: [],
			products: products.items,
			page: products.page,
			totalPages: products.totalPages,
		};
	}

	const children =
		page === 1
			? firstChildPage
			: await getChildCategories(platform?.env, category.id, page);
	return {
		category,
		children: children.items,
		products: [],
		page: children.page,
		totalPages: children.totalPages,
	};
};
