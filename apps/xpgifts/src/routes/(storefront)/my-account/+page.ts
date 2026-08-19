import { getAddresses } from "$lib/data/addresses";
import { getOrders } from "$lib/data/orders";
import { getCurrentUser } from "$lib/data/user";

export function load() {
	return {
		user: getCurrentUser(),
		recentOrders: getOrders().slice(0, 3),
		addressCount: getAddresses().length,
	};
}
