import { getCurrentUser } from "$lib/data/user";

export function load() {
	return { user: getCurrentUser() };
}
