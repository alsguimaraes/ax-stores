import {
	isWcConfigured,
	TTL,
	type WcAddress,
	type WcEnv,
	wcFetch,
} from "$lib/server/woocommerce";

export type Address = {
	firstName: string;
	lastName: string;
	company: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	phone: string;
	email: string;
};

export type CustomerAddresses = {
	billing: Address;
	shipping: Address;
};

type WcCustomer = {
	billing: WcAddress;
	shipping: WcAddress;
};

// Falls back to mock data (see src/lib/data/*.ts) whenever WC credentials
// aren't configured, same pattern as orders.ts/products.ts.
const mockAddresses: CustomerAddresses = {
	billing: {
		firstName: "Jamie",
		lastName: "Rivera",
		company: "",
		line1: "128 Maple Street",
		line2: "",
		city: "Austin",
		state: "TX",
		postalCode: "78701",
		country: "United States",
		phone: "(512) 555-0134",
		email: "jamie.rivera@example.com",
	},
	shipping: {
		firstName: "Jamie",
		lastName: "Rivera",
		company: "",
		line1: "128 Maple Street",
		line2: "",
		city: "Austin",
		state: "TX",
		postalCode: "78701",
		country: "United States",
		phone: "(512) 555-0134",
		email: "",
	},
};

function mapWcAddress(address: WcAddress): Address {
	return {
		firstName: address.first_name,
		lastName: address.last_name,
		company: address.company,
		line1: address.address_1,
		line2: address.address_2,
		city: address.city,
		state: address.state,
		postalCode: address.postcode,
		country: address.country,
		phone: address.phone ?? "",
		email: address.email ?? "",
	};
}

// WooCommerce customers only ever have exactly one billing and one shipping
// address - there's no arbitrary saved-address list in the REST API, so
// unlike orders/products there's nothing to paginate or look up by id here.
// See /my-account/addresses, which has no "add address" flow for the same
// reason.
export async function getCustomerAddresses(
	env: Partial<WcEnv> | undefined,
	customerId: string,
): Promise<CustomerAddresses> {
	if (!isWcConfigured(env)) return mockAddresses;
	const customer = await wcFetch<WcCustomer>(
		env,
		`/customers/${customerId}`,
		{},
		TTL.S,
	);
	return {
		billing: mapWcAddress(customer.billing),
		shipping: mapWcAddress(customer.shipping),
	};
}
