import type { Product } from "$lib/data/products";

// Snapshots the product at add-time rather than re-deriving it by slug on
// every render — the cart is client-only state, and product lookups now go
// through the (server-only, credentialed) WooCommerce client, so there's no
// way for the browser to re-fetch product details for a bare slug anyway.
export type CartItem = {
	product: Product;
	quantity: number;
};

export class CartStore {
	items = $state<CartItem[]>([]);

	get count(): number {
		return this.items.reduce((total, item) => total + item.quantity, 0);
	}

	add(product: Product, quantity = 1) {
		const existing = this.items.find(
			(item) => item.product.slug === product.slug,
		);
		if (existing) {
			existing.quantity += quantity;
		} else {
			this.items.push({ product, quantity });
		}
	}

	remove(productSlug: string) {
		this.items = this.items.filter((item) => item.product.slug !== productSlug);
	}

	updateQuantity(productSlug: string, quantity: number) {
		if (quantity <= 0) {
			this.remove(productSlug);
			return;
		}
		const existing = this.items.find(
			(item) => item.product.slug === productSlug,
		);
		if (existing) existing.quantity = quantity;
	}

	clear() {
		this.items = [];
	}
}
