<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>Help / FAQ — xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Help &amp; FAQ</h1>

{#each data.categories as category (category)}
	<h2 class="mt-6 mb-2 text-lg font-semibold">{category}</h2>
	<div class="flex flex-col gap-2">
		{#each data.faqs.filter((f) => f.category === category) as faq (faq.question)}
			<div class="collapse-arrow bg-base-100 border-base-300 collapse border">
				<input type="checkbox" />
				<div class="collapse-title font-medium">{faq.question}</div>
				<div class="collapse-content text-sm opacity-80">
					<p>{faq.answer}</p>
				</div>
			</div>
		{/each}
	</div>
{/each}
