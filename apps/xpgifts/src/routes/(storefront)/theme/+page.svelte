<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import CategoryCard from "$lib/components/CategoryCard.svelte";
	import Pagination from "$lib/components/Pagination.svelte";

	let { data } = $props();
</script>

<svelte:head><title>Shop by Theme - xpgifts</title></svelte:head>

<Breadcrumbs items={[{ label: "Shop by Theme" }]} />

<h1 class="mb-6 text-2xl font-bold">Shop by Theme</h1>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
	{#each data.themes as theme (theme.slug)}
		<CategoryCard href="/theme/{theme.slug}" image={theme.image} title={theme.name} />
	{/each}
</div>

<Pagination currentPage={data.page} totalPages={data.totalPages} makeHref={(p) => `/theme?page=${p}`} />
