<script lang="ts">
	import EmptyState from "$lib/components/EmptyState.svelte";
	import Pagination from "$lib/components/Pagination.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";

	let { data } = $props();
</script>

<svelte:head><title>Search{data.query ? `: ${data.query}` : ""} — xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">
	{data.query ? `Search results for "${data.query}"` : "Search"}
</h1>

{#if !data.query}
	<EmptyState title="Start typing to search" description="Use the search bar above to find personalized gifts." />
{:else if data.results.length === 0}
	<EmptyState
		title="No results found"
		description={`We couldn't find anything matching "${data.query}". Try a different search term.`}
		actionHref="/shop"
		actionLabel="Browse All Products"
	/>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.results as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
	<Pagination
		currentPage={data.page}
		totalPages={data.totalPages}
		makeHref={(p) => `/search?q=${encodeURIComponent(data.query)}&page=${p}`}
	/>
{/if}
