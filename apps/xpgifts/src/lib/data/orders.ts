import {
	isWcConfigured,
	stripHtml,
	TTL,
	type WcEnv,
	type WcOrder,
	wcFetch,
	wcFetchPaginated,
} from "$lib/server/woocommerce";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
	// Set directly for mock orders (see mockOrders below); for live orders WC
	// line items only carry productId, and productSlug/image get filled in by
	// the order-detail route after a batched product lookup - see
	// getProductsByIds in $lib/data/products.ts.
	productId?: string;
	productSlug?: string;
	image?: string;
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

// Fallback used when WooCommerce credentials aren't configured (local dev
// without .dev.vars). Remove once the store is fully wired up - see TODO.md.
const mockOrders: Order[] = [
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

// WooCommerce has no "shipped" order status (core statuses are pending,
// processing, on-hold, completed, cancelled, refunded, failed - confirmed
// against the real store's GET /wc/v3/orders args schema) and the installed
// shipment-tracking plugin's data isn't part of the order resource, so
// "shipped" can't be derived without an extra per-order request. Until that's
// worth the added complexity, anything short of completed/cancelled shows as
// "processing" - see TODO.md if that needs revisiting.
// Real, customer-facing order statuses - excludes "trash" (deleted orders
// shouldn't be visible to the customer at all) and the internal
// "auto-draft"/"checkout-draft" states (abandoned/incomplete checkouts, not
// real orders). Passed explicitly to WC rather than relying on the default
// `status=any`, whose exact trash-inclusion behavior isn't documented.
const VISIBLE_ORDER_STATUSES = [
	"pending",
	"processing",
	"on-hold",
	"completed",
	"cancelled",
	"refunded",
	"failed",
];

function mapWcOrderStatus(status: string): OrderStatus {
	if (status === "completed") return "delivered";
	if (["cancelled", "refunded", "failed", "trash"].includes(status)) {
		return "cancelled";
	}
	return "processing";
}

function formatAddress(address: WcOrder["shipping"]): string {
	const line = [address.address_1, address.address_2]
		.filter(Boolean)
		.join(", ");
	const cityState = [address.city, address.state].filter(Boolean).join(", ");
	return [line, [cityState, address.postcode].filter(Boolean).join(" ")]
		.filter(Boolean)
		.join(", ");
}

function mapWcOrder(wc: WcOrder): Order {
	// Falls back to billing when shipping is blank (e.g. digital-only orders,
	// or shipping left empty because it matches billing).
	const address =
		wc.shipping.address_1 || wc.shipping.city ? wc.shipping : wc.billing;

	return {
		id: String(wc.id),
		placedAt: wc.date_created.slice(0, 10),
		status: mapWcOrderStatus(wc.status),
		items: wc.line_items.map((item) => ({
			productId: String(item.product_id),
			name: stripHtml(item.name),
			quantity: item.quantity,
			price: Number(item.price),
		})),
		subtotal: wc.line_items.reduce((sum, item) => sum + Number(item.total), 0),
		shipping: Number(wc.shipping_total),
		total: Number(wc.total),
		shippingAddress: formatAddress(address),
	};
}

export async function getOrders(
	env: Partial<WcEnv> | undefined,
	customerId: string,
): Promise<Order[]> {
	if (!isWcConfigured(env)) return mockOrders;
	const result = await wcFetchPaginated<WcOrder>(
		env,
		"/orders",
		{
			customer: Number(customerId),
			status: VISIBLE_ORDER_STATUSES.join(","),
			per_page: 50,
			orderby: "date",
			order: "desc",
		},
		TTL.S,
	);
	return result.items.map(mapWcOrder);
}

export async function getOrderById(
	env: Partial<WcEnv> | undefined,
	customerId: string,
	id: string,
): Promise<Order | undefined> {
	if (!isWcConfigured(env)) return mockOrders.find((order) => order.id === id);

	let wcOrder: WcOrder;
	try {
		wcOrder = await wcFetch<WcOrder>(env, `/orders/${id}`, {}, TTL.S);
	} catch {
		return undefined;
	}

	// GET /orders/{id} isn't scoped to a customer - a store-wide API key can
	// return any order by id, so this ownership check is the only thing
	// stopping one customer from viewing another's order by guessing its id.
	if (String(wcOrder.customer_id) !== customerId) return undefined;
	// Deleted (trashed) orders shouldn't be viewable by direct link either,
	// same as they're excluded from the list in getOrders().
	if (!VISIBLE_ORDER_STATUSES.includes(wcOrder.status)) return undefined;

	return mapWcOrder(wcOrder);
}
