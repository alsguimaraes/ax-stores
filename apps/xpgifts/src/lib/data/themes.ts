import {
	isWcConfigured,
	type Paginated,
	paginateArray,
	type WcEnv,
	type WcTopic,
	wcFetch,
	wcFetchPaginated,
} from "$lib/server/woocommerce";

export type Theme = {
	id: number;
	parentId: number;
	slug: string;
	name: string;
	description: string;
	image: string;
};

const THEMES_PER_PAGE = 20;

// Fallback used when WooCommerce credentials aren't configured (local dev
// without .dev.vars). Remove once the store is fully wired up — see TODO.md.
const mockThemes: Theme[] = [
	{
		id: 1,
		parentId: 0,
		slug: "birthday",
		name: "Birthday",
		description: "Fun, personalized picks to celebrate another year.",
		image: "https://picsum.photos/seed/xpg-birthday/640/480",
	},
	{
		id: 2,
		parentId: 0,
		slug: "wedding",
		name: "Wedding",
		description: "Thoughtful gifts for the happy couple.",
		image: "https://picsum.photos/seed/xpg-wedding/640/480",
	},
	{
		id: 3,
		parentId: 0,
		slug: "housewarming",
		name: "Housewarming",
		description: "Warm welcomes for a brand new home.",
		image: "https://picsum.photos/seed/xpg-housewarming/640/480",
	},
	{
		id: 4,
		parentId: 0,
		slug: "new-baby",
		name: "New Baby",
		description: "Sweet keepsakes for the newest family member.",
		image: "https://picsum.photos/seed/xpg-new-baby/640/480",
	},
];

function mapWcTopic(wc: WcTopic): Theme {
	return {
		id: Number(wc.id),
		parentId: Number(wc.pid),
		slug: wc.slug,
		name: wc.nm,
		description: "",
		image: wc.image,
	};
}

// The custom /xp/topics endpoint has a ~10k-row list and no parent filter
// (see the WcTopic comment in woocommerce.ts). getThemeBySlug needs to find
// a theme or topic anywhere in that list, so it pages through in full here;
// getThemes paginates the raw endpoint directly instead (see below).
const XP_TOPICS_PER_PAGE = 100;

async function _getAllTopics(env: WcEnv): Promise<Theme[]> {
	const topics: WcTopic[] = [];
	for (let page = 1; ; page++) {
		const batch = await wcFetch<WcTopic[]>(env, "/xp/topics", {
			page,
			per_page: XP_TOPICS_PER_PAGE,
		});
		topics.push(...batch);
		if (batch.length < XP_TOPICS_PER_PAGE) break;
	}
	return topics.map(mapWcTopic);
}

export async function getThemes(
	env: Partial<WcEnv> | undefined,
	page = 1,
): Promise<Paginated<Theme>> {
	if (!isWcConfigured(env)) {
		return paginateArray(
			mockThemes.filter((theme) => theme.parentId === 0),
			page,
			THEMES_PER_PAGE,
		);
	}
	const result = await wcFetchPaginated<WcTopic>(env, "/xp/topics", {
		parent_id: 0,
		page,
		per_page: THEMES_PER_PAGE,
	});
	return {
		...result,
		items: result.items.map(mapWcTopic),
	};
}

export async function getThemeBySlug(
	env: Partial<WcEnv> | undefined,
	slug: string,
): Promise<Theme | undefined> {
	if (!isWcConfigured(env))
		return mockThemes.find((theme) => theme.slug === slug);
	const result = await wcFetchPaginated<WcTopic>(env, "/xp/topics", {
		slug,
		per_page: THEMES_PER_PAGE,
	});
	return result.items.map(mapWcTopic).find((theme) => theme.slug === slug);
}
