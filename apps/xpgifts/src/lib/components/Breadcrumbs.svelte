<script lang="ts">
	type Crumb = { label: string; href?: string };
	let { items }: { items: Crumb[] } = $props();
</script>

<div class="breadcrumbs mb-4 text-sm">
	<ul>
		<li><a href="/">Home</a></li>
		{#each items as item (item.label)}
			<li>
				{#if item.href}
					<a href={item.href}>{item.label}</a>
				{:else}
					{item.label}
				{/if}
			</li>
		{/each}
	</ul>
</div>
