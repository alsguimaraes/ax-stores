import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// locals.user is guaranteed set here - my-account/+layout.server.ts redirects
// logged-out visitors to /login before this route ever loads.
export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) redirect(303, "/login");
};
