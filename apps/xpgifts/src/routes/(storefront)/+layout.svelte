<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { setCartContext } from "$lib/stores/cart-context";
	import { setWebpContext } from "$lib/stores/webp-context";

	let { children, data } = $props();

	setCartContext();
	setWebpContext(data.supportsWebp);
</script>

<div class="flex min-h-screen flex-col">
	<Header categories={data.categories} />
	<main class="container mx-auto flex-1 px-4 py-8">
		{@render children()}
	</main>
	<Footer />
</div>
