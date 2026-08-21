<script lang="ts">
	import ProductCard from "$lib/components/ProductCard.svelte";
	import EmptyState from "$lib/components/EmptyState.svelte";

	let { data } = $props();
</script>

<svelte:head><title>Wishlist - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Wishlist</h1>

{#if data.products.length === 0}
	<EmptyState
		title="Your wishlist is empty"
		description="Save gifts you love for later."
		actionHref="/shop"
		actionLabel="Browse Products"
	/>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
{/if}
