import { redirect } from "@sveltejs/kit";
import { endSession } from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, platform }) => {
	const token = cookies.get("session");
	if (token && platform?.env) await endSession(platform.env, token);
	cookies.delete("session", { path: "/" });
	redirect(303, "/login");
};
