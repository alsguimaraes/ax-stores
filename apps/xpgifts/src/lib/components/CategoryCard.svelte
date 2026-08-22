<script lang="ts">
    import ProductCardImage from "./ProductCardImage.svelte";

	let {
		href,
		image,
		title,
		titleClass = "text-lg"
	}: { href: string; image: string; title: string; titleClass?: string } = $props();
</script>

<a {href} class="card bg-base-100 overflow-hidden shadow-sm category-card">
	<figure class="relative aspect-square">
		<ProductCardImage src={image} alt={title} size={480} loading="eager" fetchpriority="high" className="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
		<h3 class="absolute inset-x-0 bottom-0 p-4 font-bold text-white {titleClass}">{title}</h3>
	</figure>
</a>
