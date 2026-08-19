<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import Pagination from "$lib/components/Pagination.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";

	let { data } = $props();
</script>

<svelte:head><title>{data.theme.name} Gifts — xpgifts</title></svelte:head>

<Breadcrumbs items={[{ label: "Shop by Theme", href: "/theme" }, { label: data.theme.name }]} />

<h1 class="mb-6 text-2xl font-bold">{data.theme.name} Gifts</h1>
{#if data.theme.description}
	<p class="mb-6 opacity-70">{data.theme.description}</p>
{/if}

{#if data.products.length === 0}
	<p class="opacity-70">No products for this theme yet.</p>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
	<Pagination currentPage={data.page} totalPages={data.totalPages} makeHref={(p) => `/theme/${data.theme.slug}?page=${p}`} />
{/if}
