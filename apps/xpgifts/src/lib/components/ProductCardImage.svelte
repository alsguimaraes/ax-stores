<script lang="ts">
	import { getWebpContext } from "$lib/stores/webp-context";

	let { src, alt }: { src: string; alt: string } = $props();

	// Format negotiated once server-side from the request's Accept header
	// (see (storefront)/+layout.server.ts) rather than per-<img>, since a
	// Workers isolate can't feature-detect the browser any other way during SSR.
	const format = getWebpContext() ? "&webp=1" : "";
	const sizes = [360, 320, 280, 240];
	const srcset = sizes.map((size) => `${src}?fit=${size},${size}${format} ${size}w`).join(", ");
</script>

<div class="block aspect-square overflow-hidden">
	<figure class="h-full">
		<img
			{src}
			{srcset}
			{alt}
			width="360"
			height="360"
			class="h-full w-full object-cover"
			loading="lazy"
			decoding="async"
		/>
	</figure>
</div>