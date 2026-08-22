import {
	isWcConfigured,
	TTL,
	type WcCountry,
	type WcEnv,
	wcFetch,
} from "$lib/server/woocommerce";

export type Country = {
	code: string;
	name: string;
};

// Small fallback list for local dev without WC credentials configured - the
// real store returns WooCommerce's full ~250-country reference list.
const mockCountries: Country[] = [
	{ code: "US", name: "United States" },
	{ code: "CA", name: "Canada" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "AU", name: "Australia" },
];

// GET /wc/v3/data/countries is a static reference list, not scoped to a
// customer or order - cached for a full day since it changes essentially
// never.
export async function getCountries(
	env: Partial<WcEnv> | undefined,
): Promise<Country[]> {
	if (!isWcConfigured(env)) return mockCountries;
	const countries = await wcFetch<WcCountry[]>(
		env,
		"/data/countries",
		{},
		TTL.DAY,
	);
	return countries.map((country) => ({
		code: country.code,
		name: country.name,
	}));
}
