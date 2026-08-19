<script lang="ts">
	let {
		title,
		description,
		actionHref,
		actionLabel
	}: { title: string; description: string; actionHref?: string; actionLabel?: string } = $props();
</script>

<div class="flex flex-col items-center gap-4 py-16 text-center">
	<div class="text-5xl">🎁</div>
	<h3 class="text-lg font-bold">{title}</h3>
	<p class="max-w-sm text-sm opacity-70">{description}</p>
	{#if actionHref && actionLabel}
		<a href={actionHref} class="btn btn-primary btn-sm">{actionLabel}</a>
	{/if}
</div>
