import {
	isWcConfigured,
	type Paginated,
	paginateArray,
	stripHtml,
	TTL,
	type WcCategory,
	type WcEnv,
	wcFetch,
	wcFetchPaginated,
} from "$lib/server/woocommerce";

export type Category = {
	id: number;
	parentId: number;
	slug: string;
	name: string;
	description: string;
	image: string;
};

const CATEGORIES_PER_PAGE = 24;

// Fallback used when WooCommerce credentials aren't configured (local dev
// without .dev.vars). Remove once the store is fully wired up — see TODO.md.
const mockCategories: Category[] = [
	{
		id: 1,
		parentId: 0,
		slug: "clothing",
		name: "Clothing",
		description: "T-shirts, hoodies, sweatshirts, and other wearable gifts.",
		image: "https://picsum.photos/seed/xpg-clothing/640/480",
	},
	{
		id: 2,
		parentId: 0,
		slug: "living-decor",
		name: "Living & Decor",
		description: "Mugs, pillows, coasters, and decor to gift for the home.",
		image: "https://picsum.photos/seed/xpg-living-decor/640/480",
	},
	{
		id: 3,
		parentId: 0,
		slug: "arts-crafts",
		name: "Arts & Crafts",
		description: "Stickers, stencils, wood appliqués, and craft supplies.",
		image: "https://picsum.photos/seed/xpg-arts-crafts/640/480",
	},
];

function mapWcCategory(wc: WcCategory): Category {
	return {
		id: wc.id,
		parentId: wc.parent,
		slug: wc.slug,
		name: stripHtml(wc.name),
		description: stripHtml(wc.description),
		image:
			wc.image?.src ??
			"https://picsum.photos/seed/xpg-placeholder-category/640/480",
	};
}

// The real store's top-level taxonomy has ~100 categories — far too many for
// a nav menu or a home page grid — so navigation/storefront browsing is
// curated down to these three, plus a catch-all "Other" entry (below) linking
// to everything else. Use getChildCategories() to drill into a real category.
const FEATURED_CATEGORY_SLUGS = ["clothing", "living-decor", "arts-crafts"];

// Not a real WooCommerce category — a synthetic entry linking to
// /product-category/other, which lists every top-level category not
// featured above (see getOtherCategories() and its special-cased route).
const OTHER_CATEGORY: Category = {
	id: 0,
	parentId: 0,
	slug: "other",
	name: "Other",
	description: "Browse all our other gift categories.",
	image: "https://picsum.photos/seed/xpg-other-categories/640/480",
};

export async function getCategories(
	env: Partial<WcEnv> | undefined,
): Promise<Category[]> {
	const categories = await Promise.all(
		FEATURED_CATEGORY_SLUGS.map((slug) => getCategoryBySlug(env, slug)),
	);
	return [
		...categories.filter((category) => category !== undefined),
		OTHER_CATEGORY,
	];
}

export async function getOtherCategories(
	env: Partial<WcEnv> | undefined,
	page = 1,
): Promise<Paginated<Category>> {
	if (!isWcConfigured(env)) {
		const others = mockCategories.filter(
			(category) =>
				category.parentId === 0 &&
				!FEATURED_CATEGORY_SLUGS.includes(category.slug),
		);
		return paginateArray(others, page, CATEGORIES_PER_PAGE);
	}
	// WooCommerce has no "exclude these slugs" filter, so we can't paginate
	// server-side after excluding the 3 featured slugs without page sizes
	// drifting. Fetch a few extra to absorb up to 3 exclusions per page.
	const result = await wcFetchPaginated<WcCategory>(
		env,
		"/products/categories",
		{
			page,
			per_page: CATEGORIES_PER_PAGE + FEATURED_CATEGORY_SLUGS.length,
			hide_empty: true,
			parent: 0,
		},
		TTL.M,
	);
	const items = result.items
		.filter(
			(category) =>
				category.slug !== "uncategorized" &&
				!FEATURED_CATEGORY_SLUGS.includes(category.slug),
		)
		.slice(0, CATEGORIES_PER_PAGE)
		.map(mapWcCategory);
	return { ...result, items, perPage: CATEGORIES_PER_PAGE };
}

export async function getCategoryBySlug(
	env: Partial<WcEnv> | undefined,
	slug: string,
): Promise<Category | undefined> {
	if (!isWcConfigured(env))
		return mockCategories.find((category) => category.slug === slug);
	const categories = await wcFetch<WcCategory[]>(
		env,
		"/products/categories",
		{
			slug,
		},
		TTL.L,
	);
	return categories[0] ? mapWcCategory(categories[0]) : undefined;
}

export async function getChildCategories(
	env: Partial<WcEnv> | undefined,
	parentId: number,
	page = 1,
): Promise<Paginated<Category>> {
	if (!isWcConfigured(env)) {
		const children = mockCategories.filter(
			(category) => category.parentId === parentId,
		);
		return paginateArray(children, page, CATEGORIES_PER_PAGE);
	}
	const result = await wcFetchPaginated<WcCategory>(
		env,
		"/products/categories",
		{
			page,
			per_page: CATEGORIES_PER_PAGE,
			parent: parentId,
			hide_empty: true,
		},
		TTL.M,
	);
	return { ...result, items: result.items.map(mapWcCategory) };
}
