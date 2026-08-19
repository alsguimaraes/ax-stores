import { error } from "@sveltejs/kit";
import { getAddressById } from "$lib/data/addresses";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	const address = getAddressById(params.id);
	if (!address) error(404, "Address not found");
	return { address };
};
