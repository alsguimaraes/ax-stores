import { getContext, setContext } from "svelte";
import { CartStore } from "./cart.svelte";

// Symbol keyed context so the cart is a fresh instance per request/session
// (a Cloudflare Workers isolate can serve multiple users — a module-level
// singleton would leak one shopper's cart into another's SSR render).
const CART_KEY = Symbol("cart");

export function setCartContext(): CartStore {
	const cart = new CartStore();
	setContext(CART_KEY, cart);
	return cart;
}

export function getCartContext(): CartStore {
	return getContext<CartStore>(CART_KEY);
}
