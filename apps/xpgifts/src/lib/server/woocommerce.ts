export type WcEnv = {
	WC_STORE_URL: string;
	WC_CONSUMER_KEY: string;
	WC_CONSUMER_SECRET: string;
};

// Falls back to mock data (see src/lib/data/*.ts) whenever these aren't set,
// so local dev works without a real store. Set them in .dev.vars locally and
// via `wrangler secret put` / wrangler.jsonc `vars` in production — see TODO.md.
export function isWcConfigured(env: Partial<WcEnv> | undefined): env is WcEnv {
	return Boolean(
		env?.WC_STORE_URL && env.WC_CONSUMER_KEY && env.WC_CONSUMER_SECRET,
	);
}

export async function wcFetch<T>(
	env: WcEnv,
	path: string,
	params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const url = new URL(`/wp-json/wc/v3${path}`, env.WC_STORE_URL);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}

	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(url, {
		headers: { Authorization: `Basic ${credentials}` },
	});

	if (!response.ok) {
		throw new Error(
			`WooCommerce API error ${response.status} on ${path}: ${await response.text()}`,
		);
	}

	return response.json() as Promise<T>;
}

export type Paginated<T> = {
	items: T[];
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
};

// Same as wcFetch, but reads WooCommerce's X-WP-Total / X-WP-TotalPages
// response headers for list endpoints (products, categories, ...).
export async function wcFetchPaginated<T>(
	env: WcEnv,
	path: string,
	params: Record<string, string | number | boolean | undefined> & {
		page?: number;
		slug?: string;
		_unstable_tax_topics?: string;
		per_page: number;
	},
): Promise<Paginated<T>> {
	const page = params.page ?? 1;
	const url = new URL(`/wp-json/wc/v3${path}`, env.WC_STORE_URL);
	for (const [key, value] of Object.entries({ ...params, page })) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	console.warn(url.toString());
	const credentials = btoa(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`);
	const response = await fetch(url, {
		headers: { Authorization: `Basic ${credentials}` },
	});

	if (!response.ok) {
		throw new Error(
			`WooCommerce API error ${response.status} on ${path}: ${await response.text()}`,
		);
	}

	const total = Number(response.headers.get("X-WP-Total") ?? 0);
	const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 0);
	const items = (await response.json()) as T[];

	return { items, page, perPage: params.per_page, total, totalPages };
}

// Client-side pagination over the mock arrays, so the mock fallback (see
// src/lib/data/*.ts) behaves the same as the live paginated WC calls.
export function paginateArray<T>(
	items: T[],
	page: number,
	perPage: number,
): Paginated<T> {
	const start = (page - 1) * perPage;
	return {
		items: items.slice(start, start + perPage),
		page,
		perPage,
		total: items.length,
		totalPages: Math.max(1, Math.ceil(items.length / perPage)),
	};
}

// Minimal shapes for the fields this app actually uses — WooCommerce's real
// responses include many more fields than this.
export type WcProduct = {
	id: number;
	slug: string;
	name: string;
	description: string;
	price: string;
	regular_price: string;
	on_sale: boolean;
	images: { src: string }[];
	categories: { id: number; name: string; slug: string }[];
	// Assumes "themes" (Birthday, Wedding, etc.) are modeled as product tags —
	// unconfirmed against the real store, see TODO.md "Themes taxonomy exposure".
	tags: { id: number; name: string; slug: string }[];
	average_rating: string;
	rating_count: number;
	stock_status: "instock" | "outofstock" | "onbackorder";
	featured: boolean;
};

export type WcCategory = {
	id: number;
	parent: number;
	slug: string;
	name: string;
	description: string;
	image: { src: string } | null;
};

// Custom endpoint (GET /wc/v3/xp/topics) backing "Shop by Theme" — not part of
// stock WooCommerce REST API v3. Ids/pid come back as numeric strings, there's
// no description, and it honors page/per_page and parent_id, so the full
// ~10k-row list only needs paging through in full for slug lookups — see
// getAllTopics in themes.ts.
export type WcTopic = {
	id: string;
	nm: string;
	pid: string;
	slug: string;
	image: string;
};

const HTML_ENTITIES: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#039;": "'",
	"&nbsp;": " ",
};

// WooCommerce/WordPress return rendered HTML in text fields — strip tags and
// decode the common entities so callers get plain text.
export function stripHtml(html: string): string {
	const withoutTags = html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return withoutTags.replace(
		/&amp;|&lt;|&gt;|&quot;|&#039;|&nbsp;/g,
		(entity) => HTML_ENTITIES[entity] ?? entity,
	);
}
