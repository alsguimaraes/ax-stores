<script lang="ts">
	import CategoryCard from "$lib/components/CategoryCard.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";

	let { data } = $props();
</script>

<svelte:head><title>xpgifts — Personalized Gifts for Every Occasion</title></svelte:head>

<div class="hero bg-base-200 rounded-box mb-12">
	<div class="hero-content flex-col py-16 text-center">
		<h1 class="text-4xl font-bold md:text-5xl">Gifts they'll actually love</h1>
		<p class="max-w-xl py-4 opacity-70">
			Personalized clothing, decor, and keepsakes for birthdays, weddings, new homes, and new babies.
		</p>
		<a href="/shop" class="btn btn-primary">Shop All Gifts</a>
	</div>
</div>

<section class="mb-12">
	<h2 class="mb-4 text-2xl font-bold">Shop by Category</h2>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
		{#each data.categories as category (category.slug)}
			<CategoryCard href="/product-category/{category.slug}" image={category.image} name={category.name} />
		{/each}
	</div>
</section>

<section>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-2xl font-bold">Featured Gifts</h2>
		<a href="/shop" class="link">View all</a>
	</div>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.featuredProducts as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
</section>
