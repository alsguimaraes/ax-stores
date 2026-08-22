<script lang="ts">
	import type { Product } from "$lib/data/products";
	import { getCartContext } from "$lib/stores/cart-context";
	import ProductCardImage from "./ProductCardImage.svelte";

	let { product }: { product: Product } = $props();
	const cart = getCartContext();
</script>

<div class="card bg-base-100 shadow-sm transition-shadow hover:shadow-md product-card">
	<a href="/product/{product.slug}" class="block">
		<div class="block aspect-square overflow-hidden">
			<figure class="h-full">
				<ProductCardImage src={product.images[0]} alt={product.title} />
			</figure>
		</div>	
		<div class="card-body gap-2 p-4">
			<h2 class="line-clamp-2 font-medium truncate">{product.title}</h2>
			<div class="flex items-center gap-2">
				<span class="text-lg font-semibold">${product.price.toFixed(2)}</span>
				{#if product.compareAtPrice}
					<span class="text-sm line-through opacity-50">${product.compareAtPrice.toFixed(2)}</span>
				{/if}
			</div>
			<button class="btn btn-primary btn-sm mt-2" disabled={!product.inStock} onclick={() => cart.add(product)}>
				{product.inStock ? "Add to Cart" : "Out of Stock"}
			</button>
		</div>
	</a>
</div>
