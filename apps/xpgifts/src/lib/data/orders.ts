export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
	productSlug: string;
	name: string;
	quantity: number;
	price: number;
};

export type Order = {
	id: string;
	placedAt: string;
	status: OrderStatus;
	items: OrderItem[];
	subtotal: number;
	shipping: number;
	total: number;
	shippingAddress: string;
};

const orders: Order[] = [
	{
		id: "XPG-10482",
		placedAt: "2026-08-01",
		status: "delivered",
		items: [
			{
				productSlug: "personalized-photo-mug",
				name: "Personalized Photo Mug",
				quantity: 2,
				price: 16.99,
			},
			{
				productSlug: "custom-name-throw-pillow",
				name: "Custom Name Throw Pillow",
				quantity: 1,
				price: 34.99,
			},
		],
		subtotal: 68.97,
		shipping: 5.99,
		total: 74.96,
		shippingAddress: "128 Maple Street, Austin, TX 78701",
	},
	{
		id: "XPG-10513",
		placedAt: "2026-08-06",
		status: "shipped",
		items: [
			{
				productSlug: "custom-family-name-hoodie",
				name: "Custom Family Name Hoodie",
				quantity: 1,
				price: 48.99,
			},
		],
		subtotal: 48.99,
		shipping: 6.99,
		total: 55.98,
		shippingAddress: "128 Maple Street, Austin, TX 78701",
	},
	{
		id: "XPG-10559",
		placedAt: "2026-08-11",
		status: "processing",
		items: [
			{
				productSlug: "engraved-wooden-cutting-board",
				name: "Engraved Wooden Cutting Board",
				quantity: 1,
				price: 39.99,
			},
			{
				productSlug: "custom-family-name-coasters-set",
				name: "Custom Family Name Coasters (Set of 4)",
				quantity: 1,
				price: 22.99,
			},
		],
		subtotal: 62.98,
		shipping: 5.99,
		total: 68.97,
		shippingAddress: "44 Birchwood Ave, Denver, CO 80203",
	},
	{
		id: "XPG-10390",
		placedAt: "2026-07-18",
		status: "cancelled",
		items: [
			{
				productSlug: "embroidered-dad-cap",
				name: 'Embroidered "World\'s Best Dad" Cap',
				quantity: 1,
				price: 19.99,
			},
		],
		subtotal: 19.99,
		shipping: 4.99,
		total: 24.98,
		shippingAddress: "128 Maple Street, Austin, TX 78701",
	},
];

export function getOrders(): Order[] {
	return orders;
}

export function getOrderById(id: string): Order | undefined {
	return orders.find((order) => order.id === id);
}
