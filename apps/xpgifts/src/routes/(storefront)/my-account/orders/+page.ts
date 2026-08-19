import { getOrders } from "$lib/data/orders";

export function load() {
	return { orders: getOrders() };
}
