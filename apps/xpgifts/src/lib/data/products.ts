import {
	firstPart,
	isWcConfigured,
	lastPart,
	type Paginated,
	paginateArray,
	stripHtml,
	TTL,
	type WcEnv,
	type WcProduct,
	wcFetch,
	wcFetchPaginated,
} from "$lib/server/woocommerce";

export type Product = {
	id: string;
	slug: string;
	title: string;
	subtitle?: string;
	sku?: string;
	description: string;
	price: number;
	compareAtPrice?: number;
	images: string[];
	categorySlug: string;
	themeSlugs: string[];
	rating: number;
	reviewCount: number;
	inStock: boolean;
};

const PRODUCTS_PER_PAGE = 24;

// Fallback used when WooCommerce credentials aren't configured (local dev
// without .dev.vars). Remove once the store is fully wired up - see TODO.md.
const mockProducts: Product[] = [
	{
		id: "p1",
		slug: "custom-family-name-hoodie",
		title: "Custom Family Name Hoodie",
		description:
			"A cozy fleece hoodie personalized with your family's name and established date. Available in six colors.",
		price: 48.99,
		compareAtPrice: 59.99,
		images: [
			"https://picsum.photos/seed/xpg-p1-a/800/800",
			"https://picsum.photos/seed/xpg-p1-b/800/800",
		],
		categorySlug: "clothing",
		themeSlugs: ["housewarming", "birthday"],
		rating: 4.7,
		reviewCount: 214,
		inStock: true,
	},
	{
		id: "p2",
		slug: "personalized-birth-month-tshirt",
		title: "Personalized Birth Month T-Shirt",
		description:
			"Soft cotton tee featuring a custom birth flower and month, perfect for a birthday gift.",
		price: 24.99,
		images: ["https://picsum.photos/seed/xpg-p2-a/800/800"],
		categorySlug: "clothing",
		themeSlugs: ["birthday", "new-baby"],
		rating: 4.5,
		reviewCount: 98,
		inStock: true,
	},
	{
		id: "p3",
		slug: "matching-couple-sweatshirts",
		title: "Matching Couple Sweatshirts (Set of 2)",
		description:
			"His-and-hers crewneck sweatshirts with custom wedding date embroidery.",
		price: 64.99,
		images: ["https://picsum.photos/seed/xpg-p3-a/800/800"],
		categorySlug: "clothing",
		themeSlugs: ["wedding"],
		rating: 4.8,
		reviewCount: 156,
		inStock: true,
	},
	{
		id: "p4",
		slug: "custom-pet-portrait-tee",
		title: "Custom Pet Portrait T-Shirt",
		description:
			"Upload a photo of your pet and we'll turn it into a one-of-a-kind cartoon portrait print.",
		price: 27.99,
		images: ["https://picsum.photos/seed/xpg-p4-a/800/800"],
		categorySlug: "clothing",
		themeSlugs: ["birthday"],
		rating: 4.6,
		reviewCount: 312,
		inStock: true,
	},
	{
		id: "p5",
		slug: "embroidered-dad-cap",
		title: 'Embroidered "World\'s Best Dad" Cap',
		description:
			"Adjustable dad cap with custom embroidered text, a classic gift for Father's Day or birthdays.",
		price: 19.99,
		images: ["https://picsum.photos/seed/xpg-p5-a/800/800"],
		categorySlug: "clothing",
		themeSlugs: ["birthday"],
		rating: 4.4,
		reviewCount: 87,
		inStock: false,
	},
	{
		id: "p6",
		slug: "personalized-photo-mug",
		title: "Personalized Photo Mug",
		description:
			"Ceramic 11oz mug printed with your favorite photo and a custom message.",
		price: 16.99,
		images: [
			"https://picsum.photos/seed/xpg-p6-a/800/800",
			"https://picsum.photos/seed/xpg-p6-b/800/800",
		],
		categorySlug: "living-decor",
		themeSlugs: ["birthday", "housewarming"],
		rating: 4.6,
		reviewCount: 421,
		inStock: true,
	},
	{
		id: "p7",
		slug: "custom-name-throw-pillow",
		title: "Custom Name Throw Pillow",
		description:
			"Soft velvet throw pillow with a custom monogram, insert included.",
		price: 34.99,
		images: ["https://picsum.photos/seed/xpg-p7-a/800/800"],
		categorySlug: "living-decor",
		themeSlugs: ["wedding", "housewarming"],
		rating: 4.5,
		reviewCount: 143,
		inStock: true,
	},
	{
		id: "p8",
		slug: "engraved-wooden-cutting-board",
		title: "Engraved Wooden Cutting Board",
		description:
			"Solid acacia wood cutting board laser-engraved with a custom family name and est. date.",
		price: 39.99,
		compareAtPrice: 49.99,
		images: ["https://picsum.photos/seed/xpg-p8-a/800/800"],
		categorySlug: "living-decor",
		themeSlugs: ["wedding", "housewarming"],
		rating: 4.9,
		reviewCount: 267,
		inStock: true,
	},
	{
		id: "p9",
		slug: "birth-flower-compact-mirror",
		title: "Birth Flower Compact Mirror",
		description:
			"Pocket-sized compact mirror engraved with a custom birth flower design.",
		price: 14.99,
		images: ["https://picsum.photos/seed/xpg-p9-a/800/800"],
		categorySlug: "living-decor",
		themeSlugs: ["birthday"],
		rating: 4.3,
		reviewCount: 64,
		inStock: true,
	},
	{
		id: "p10",
		slug: "custom-family-name-coasters-set",
		title: "Custom Family Name Coasters (Set of 4)",
		description:
			"Cork-backed coasters personalized with your family name, sold as a set of four.",
		price: 22.99,
		images: ["https://picsum.photos/seed/xpg-p10-a/800/800"],
		categorySlug: "living-decor",
		themeSlugs: ["housewarming", "wedding"],
		rating: 4.7,
		reviewCount: 189,
		inStock: true,
	},
	{
		id: "p11",
		slug: "new-baby-keepsake-ornament",
		title: "New Baby Keepsake Ornament",
		description:
			"Hand-painted ceramic ornament personalized with baby's name and birth date.",
		price: 18.99,
		images: ["https://picsum.photos/seed/xpg-p11-a/800/800"],
		categorySlug: "living-decor",
		themeSlugs: ["new-baby"],
		rating: 4.8,
		reviewCount: 76,
		inStock: true,
	},
	{
		id: "p12",
		slug: "cozy-knit-throw-blanket",
		title: "Cozy Knit Throw Blanket",
		description:
			"Chunky knit throw blanket, personalized with an embroidered monogram corner.",
		price: 44.99,
		images: ["https://picsum.photos/seed/xpg-p12-a/800/800"],
		categorySlug: "living-decor",
		themeSlugs: ["housewarming"],
		rating: 4.6,
		reviewCount: 132,
		inStock: true,
	},
	{
		id: "p13",
		slug: "personalized-vinyl-name-stickers",
		title: "Personalized Vinyl Name Stickers (Pack of 20)",
		description:
			"Waterproof vinyl stickers featuring a custom name in your choice of font and color.",
		price: 9.99,
		images: ["https://picsum.photos/seed/xpg-p13-a/800/800"],
		categorySlug: "arts-crafts",
		themeSlugs: ["birthday"],
		rating: 4.5,
		reviewCount: 298,
		inStock: true,
	},
	{
		id: "p14",
		slug: "custom-monogram-stencil-kit",
		title: "Custom Monogram Stencil Kit",
		description:
			"Reusable stencil kit for DIY monogram projects around the home.",
		price: 17.99,
		images: ["https://picsum.photos/seed/xpg-p14-a/800/800"],
		categorySlug: "arts-crafts",
		themeSlugs: ["housewarming"],
		rating: 4.2,
		reviewCount: 41,
		inStock: true,
	},
	{
		id: "p15",
		slug: "wood-applique-nursery-letters",
		title: "Wood Appliqué Nursery Letters",
		description:
			"Unfinished wood letters ready to paint, perfect for spelling out baby's name.",
		price: 21.99,
		images: ["https://picsum.photos/seed/xpg-p15-a/800/800"],
		categorySlug: "arts-crafts",
		themeSlugs: ["new-baby"],
		rating: 4.6,
		reviewCount: 55,
		inStock: true,
	},
	{
		id: "p16",
		slug: "custom-wedding-napkins",
		title: "Custom Wedding Napkins (Pack of 50)",
		description:
			"Printed cocktail napkins featuring the couple's initials and wedding date.",
		price: 26.99,
		images: ["https://picsum.photos/seed/xpg-p16-a/800/800"],
		categorySlug: "arts-crafts",
		themeSlugs: ["wedding"],
		rating: 4.4,
		reviewCount: 39,
		inStock: true,
	},
];

function mapWcProduct(wc: WcProduct): Product {
	return {
		id: String(wc.id),
		slug: wc.slug,
		title: firstPart(wc.name),
		subtitle: lastPart(wc.name),
		description: stripHtml(wc.description),
		price: Number(wc.price),
		sku: wc.sku || String(wc.id),
		compareAtPrice:
			wc.on_sale && wc.regular_price ? Number(wc.regular_price) : undefined,
		images:
			wc.images.length > 0
				? wc.images.map((image) => image.src)
				: ["https://media.xpgifts.com/placeholder.png"],
		categorySlug: wc.categories[0]?.slug ?? "",
		// See src/lib/server/woocommerce.ts WcProduct.tags comment - themes are
		// assumed to be product tags until confirmed against the real store.
		themeSlugs: wc.tags.map((tag) => tag.slug),
		rating: Number(wc.average_rating) || 0,
		reviewCount: wc.rating_count,
		inStock: wc.stock_status === "instock",
	};
}

export async function getProducts(
	env: Partial<WcEnv> | undefined,
	page = 1,
): Promise<Paginated<Product>> {
	if (!isWcConfigured(env))
		return paginateArray(mockProducts, page, PRODUCTS_PER_PAGE);
	const result = await wcFetchPaginated<WcProduct>(
		env,
		"/products",
		{
			page,
			per_page: PRODUCTS_PER_PAGE,
		},
		TTL.S,
	);
	return { ...result, items: result.items.map(mapWcProduct) };
}

export async function getProductBySlug(
	env: Partial<WcEnv> | undefined,
	slug: string,
): Promise<Product | undefined> {
	if (!isWcConfigured(env))
		return mockProducts.find((product) => product.slug === slug);
	const products = await wcFetch<WcProduct[]>(
		env,
		"/products",
		{ slug },
		TTL.S,
	);
	return products[0] ? mapWcProduct(products[0]) : undefined;
}

export async function getProductsByCategory(
	env: Partial<WcEnv> | undefined,
	categorySlug: string,
	page = 1,
): Promise<Paginated<Product>> {
	if (!isWcConfigured(env)) {
		const products = mockProducts.filter(
			(product) => product.categorySlug === categorySlug,
		);
		return paginateArray(products, page, PRODUCTS_PER_PAGE);
	}
	// WooCommerce filters products by category ID, not slug, so resolve it first.
	const categories = await wcFetch<{ id: number }[]>(
		env,
		"/products/categories",
		{ slug: categorySlug },
		TTL.M,
	);
	const categoryId = categories[0]?.id;
	if (!categoryId) return paginateArray([], page, PRODUCTS_PER_PAGE);
	const result = await wcFetchPaginated<WcProduct>(
		env,
		"/products",
		{
			page,
			category: categoryId,
			per_page: PRODUCTS_PER_PAGE,
		},
		TTL.S,
	);
	return { ...result, items: result.items.map(mapWcProduct) };
}

export async function getProductsByTheme(
	env: Partial<WcEnv> | undefined,
	themeSlug: string,
	page = 1,
): Promise<Paginated<Product>> {
	if (!isWcConfigured(env)) {
		const products = mockProducts.filter((product) =>
			product.themeSlugs.includes(themeSlug),
		);
		return paginateArray(products, page, PRODUCTS_PER_PAGE);
	}
	const result = await wcFetchPaginated<WcProduct>(
		env,
		"/products",
		{
			page,
			theme: themeSlug,
			per_page: PRODUCTS_PER_PAGE,
		},
		TTL.S,
	);

	return { ...result, items: result.items.map(mapWcProduct) };
}

export async function searchProducts(
	env: Partial<WcEnv> | undefined,
	query: string,
	page = 1,
): Promise<Paginated<Product>> {
	const q = query.trim();
	if (!q) return paginateArray([], page, PRODUCTS_PER_PAGE);
	if (!isWcConfigured(env)) {
		const lower = q.toLowerCase();
		const products = mockProducts.filter(
			(product) =>
				product.title.toLowerCase().includes(lower) ||
				product.description.toLowerCase().includes(lower),
		);
		return paginateArray(products, page, PRODUCTS_PER_PAGE);
	}
	const result = await wcFetchPaginated<WcProduct>(
		env,
		"/products",
		{
			page,
			search: q,
			per_page: PRODUCTS_PER_PAGE,
		},
		TTL.S,
	);
	return { ...result, items: result.items.map(mapWcProduct) };
}

export async function getFeaturedProducts(
	env: Partial<WcEnv> | undefined,
	limit = 8,
): Promise<Product[]> {
	if (!isWcConfigured(env)) return mockProducts.slice(0, limit);
	const products = await wcFetch<WcProduct[]>(
		env,
		"/products",
		{
			featured: true,
			per_page: limit,
		},
		TTL.M,
	);
	return products.map(mapWcProduct);
}

// Batches a set of product ids into a single request via WC's `include`
// filter, rather than fetching each product individually - used to enrich
// order line items (which only carry a product_id) with slug/image, see
// my-account/orders/[id]/+page.server.ts.
export async function getProductsByIds(
	env: Partial<WcEnv> | undefined,
	ids: string[],
): Promise<Product[]> {
	if (ids.length === 0) return [];
	if (!isWcConfigured(env)) {
		return mockProducts.filter((product) => ids.includes(product.id));
	}
	const products = await wcFetch<WcProduct[]>(
		env,
		"/products",
		{ include: ids.join(","), per_page: ids.length },
		TTL.S,
	);
	return products.map(mapWcProduct);
}

export async function getRelatedProducts(
	env: Partial<WcEnv> | undefined,
	product: Product,
	limit = 4,
): Promise<Product[]> {
	const { items } = await getProductsByCategory(env, product.categorySlug);
	return items
		.filter((candidate) => candidate.id !== product.id)
		.slice(0, limit);
}
