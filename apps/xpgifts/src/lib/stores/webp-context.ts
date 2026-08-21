import { getContext, setContext } from "svelte";

// Symbol keyed context so this is a fresh value per request (a Cloudflare
// Workers isolate can serve multiple users - a module-level singleton would
// leak one visitor's Accept header into another's SSR render).
const WEBP_KEY = Symbol("webp");

export function setWebpContext(supportsWebp: boolean): void {
	setContext(WEBP_KEY, supportsWebp);
}

export function getWebpContext(): boolean {
	return getContext<boolean>(WEBP_KEY) ?? false;
}
