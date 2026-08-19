<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import Pagination from "$lib/components/Pagination.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";

	let { data } = $props();
</script>

<svelte:head><title>All Products — xpgifts</title></svelte:head>

<Breadcrumbs items={[{ label: "Shop" }]} />

<h1 class="mb-6 text-2xl font-bold">All Products</h1>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
	{#each data.products as product (product.id)}
		<ProductCard {product} />
	{/each}
</div>

<Pagination currentPage={data.page} totalPages={data.totalPages} makeHref={(p) => `/shop?page=${p}`} />
