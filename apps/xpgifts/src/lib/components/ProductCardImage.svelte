<script lang="ts">
	import { getWebpContext } from "$lib/stores/webp-context";

	let { src, alt, size = 360, className = "h-full w-full object-cover" }: { src: string; alt: string; size?: number; className?: string } = $props();

	// Format negotiated once server-side from the request's Accept header
	// (see (storefront)/+layout.server.ts) rather than per-<img>, since a
	// Workers isolate can't feature-detect the browser any other way during SSR.
	const format = getWebpContext() ? "&webp=1" : "";
	const sizes = [720, 600, 360, 320, 280, 240].filter((s) => s <= size);
	const srcset = sizes.map((size) => `${src}?fit=${size},${size}${format} ${size}w`).join(", ");
</script>

<img
	{src}
	{srcset}
	{alt}
	width={size}
	height={size}
	class={className}
	loading="lazy"
	decoding="async"
/>
