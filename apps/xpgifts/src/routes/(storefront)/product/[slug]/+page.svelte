<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";
	import { getCartContext } from "$lib/stores/cart-context";

	let { data } = $props();
	const cart = getCartContext();

	let quantity = $state(1);
	let activeImage = $state(0);
	let activeTab = $state<"description" | "shipping">("description");
</script>

<svelte:head><title>{data.product.name} - xpgifts</title></svelte:head>

<Breadcrumbs
	items={[
		{
			label: data.category?.name ?? "Shop",
			href: data.category ? `/product-category/${data.category.slug}` : undefined
		},
		{ label: data.product.name }
	]}
/>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
	<div>
		<div class="rounded-box bg-base-200 aspect-square overflow-hidden">
			<img src={data.product.images[activeImage]} alt={data.product.name} class="h-full w-full object-cover" />
		</div>
		{#if data.product.images.length > 1}
			<div class="mt-2 flex gap-2">
				{#each data.product.images as image, i (image)}
					<button
						class="rounded-box h-16 w-16 overflow-hidden border-2 {activeImage === i
							? 'border-primary'
							: 'border-transparent'}"
						onclick={() => (activeImage = i)}
					>
						<img src={image} alt="" class="h-full w-full object-cover" />
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div>
		<h1 class="text-2xl font-bold">{data.product.name}</h1>

		<div class="mt-4 flex items-center gap-3">
			<span class="text-3xl font-bold">${data.product.price.toFixed(2)}</span>
			{#if data.product.compareAtPrice}
				<span class="text-lg line-through opacity-50">${data.product.compareAtPrice.toFixed(2)}</span>
			{/if}
		</div>

		<div class="mt-6 flex items-center gap-3">
			<div class="join">
				<button class="btn join-item" onclick={() => (quantity = Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
				<span class="btn join-item pointer-events-none w-12">{quantity}</span>
				<button class="btn join-item" onclick={() => (quantity += 1)} aria-label="Increase quantity">+</button>
			</div>
			<button
				class="btn btn-primary flex-1"
				disabled={!data.product.inStock}
				onclick={() => cart.add(data.product, quantity)}
			>
				{data.product.inStock ? "Add to Cart" : "Out of Stock"}
			</button>
		</div>

		<div role="tablist" class="tabs tabs-border mt-8">
			<button
				role="tab"
				class="tab {activeTab === 'description' ? 'tab-active' : ''}"
				onclick={() => (activeTab = "description")}
			>
				Description
			</button>
			<button
				role="tab"
				class="tab {activeTab === 'shipping' ? 'tab-active' : ''}"
				onclick={() => (activeTab = "shipping")}
			>
				Shipping &amp; Returns
			</button>
		</div>
		<div class="prose prose-sm max-w-none py-4">
			{#if activeTab === "description"}
				<p>{data.product.description}</p>
			{:else}
				<p>
					Ships in 2-4 business days. See our <a href="/shipping-policy">Shipping Policy</a> and
					<a href="/refund-policy">Returns &amp; Refunds</a> for details.
				</p>
			{/if}
		</div>
	</div>
</div>

{#if data.related.length > 0}
	<section class="mt-16">
		<h2 class="mb-4 text-2xl font-bold">You may also like</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each data.related as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	</section>
{/if}
