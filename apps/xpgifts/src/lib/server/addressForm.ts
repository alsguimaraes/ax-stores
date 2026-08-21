// Shared form-parsing/validation for the billing and shipping address edit
// routes (see routes/(storefront)/my-account/addresses/{billing,shipping}/edit).
export type AddressFormValues = {
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

export const EMPTY_ADDRESS_VALUES: AddressFormValues = {
	firstName: "",
	lastName: "",
	company: "",
	line1: "",
	line2: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
	phone: "",
	email: "",
};

export function readAddressForm(data: FormData): AddressFormValues {
	return {
		firstName: String(data.get("firstName") ?? "").trim(),
		lastName: String(data.get("lastName") ?? "").trim(),
		company: String(data.get("company") ?? "").trim(),
		line1: String(data.get("line1") ?? "").trim(),
		line2: String(data.get("line2") ?? "").trim(),
		city: String(data.get("city") ?? "").trim(),
		state: String(data.get("state") ?? "").trim(),
		postalCode: String(data.get("postalCode") ?? "").trim(),
		country: String(data.get("country") ?? "").trim(),
		phone: String(data.get("phone") ?? "").trim(),
		email: String(data.get("email") ?? "").trim(),
	};
}

// `requireEmail` is only true for billing - WC's shipping address has no
// email field.
export function validateAddress(
	values: AddressFormValues,
	requireEmail: boolean,
): string | undefined {
	if (
		!values.firstName ||
		!values.lastName ||
		!values.line1 ||
		!values.city ||
		!values.state ||
		!values.postalCode ||
		!values.country
	) {
		return "Please fill in all required fields.";
	}
	if (requireEmail) {
		if (!values.email) return "Email is required.";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			return "Enter a valid email address.";
		}
	}
	return undefined;
}
