import { getAddresses } from "$lib/data/addresses";

export function load() {
	return { addresses: getAddresses() };
}
