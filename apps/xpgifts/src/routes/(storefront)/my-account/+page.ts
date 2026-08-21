import { getAddresses } from "$lib/data/addresses";
import { getOrders } from "$lib/data/orders";

export function load() {
	return {
		recentOrders: getOrders().slice(0, 3),
		addressCount: getAddresses().length,
	};
}
