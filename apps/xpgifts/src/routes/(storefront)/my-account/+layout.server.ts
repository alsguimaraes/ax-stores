import type { LayoutServerLoad } from "./$types";

// TODO: once auth exists, check the session cookie here and redirect to
// /login if there isn't one (e.g. `if (!locals.user) redirect(303, "/login")`).
export const load: LayoutServerLoad = () => {
	return {};
};
