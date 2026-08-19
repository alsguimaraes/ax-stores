export type Address = {
	id: string;
	label: string;
	fullName: string;
	line1: string;
	line2?: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	phone: string;
	isDefault: boolean;
};

const addresses: Address[] = [
	{
		id: "addr_1",
		label: "Home",
		fullName: "Jamie Rivera",
		line1: "128 Maple Street",
		city: "Austin",
		state: "TX",
		postalCode: "78701",
		country: "United States",
		phone: "(512) 555-0134",
		isDefault: true,
	},
	{
		id: "addr_2",
		label: "Work",
		fullName: "Jamie Rivera",
		line1: "44 Birchwood Ave",
		line2: "Suite 200",
		city: "Denver",
		state: "CO",
		postalCode: "80203",
		country: "United States",
		phone: "(303) 555-0198",
		isDefault: false,
	},
];

export function getAddresses(): Address[] {
	return addresses;
}

export function getAddressById(id: string): Address | undefined {
	return addresses.find((address) => address.id === id);
}
