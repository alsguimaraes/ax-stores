<script lang="ts">
	let {
		href,
		image,
		name,
		titleClass = "text-lg"
	}: { href: string; image: string; name: string; titleClass?: string } = $props();
</script>

<a {href} class="card bg-base-100 overflow-hidden shadow-sm">
	<figure class="relative aspect-square">
		<img src={image} alt={name} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
		<h3 class="absolute inset-x-0 bottom-0 p-4 font-bold text-white {titleClass}">{name}</h3>
	</figure>
</a>
