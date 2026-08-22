<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import CategoryCard from "$lib/components/CategoryCard.svelte";
	import Pagination from "$lib/components/Pagination.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";

	let { data } = $props();
</script>

<svelte:head><title>{data.category.title} - xpgifts</title></svelte:head>

<Breadcrumbs items={[{ label: data.category.title }]} />

<h1 class="mb-1 text-2xl font-bold">{data.category.title}</h1>
<p class="mb-6 opacity-70">{data.category.description}</p>

{#if data.children.length > 0}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.children as child (child.slug)}
			<CategoryCard href="/product-category/{child.slug}" image={child.image} title={child.title} titleClass="text-base" />
		{/each}
	</div>
	<Pagination
		currentPage={data.page}
		totalPages={data.totalPages}
		makeHref={(p) => `/product-category/${data.category.slug}?page=${p}`}
	/>
{:else if data.products.length === 0}
	<p class="opacity-70">No products in this category yet.</p>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
	<Pagination
		currentPage={data.page}
		totalPages={data.totalPages}
		makeHref={(p) => `/product-category/${data.category.slug}?page=${p}`}
	/>
{/if}
