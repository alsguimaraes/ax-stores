<script lang="ts">
	let {
		currentPage,
		totalPages,
		makeHref
	}: { currentPage: number; totalPages: number; makeHref: (page: number) => string } = $props();

	function pageNumbers(): (number | "…")[] {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const keep = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
		const sorted = [...keep].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
		const result: (number | "…")[] = [];
		let previous = 0;
		for (const p of sorted) {
			if (previous && p - previous > 1) result.push("…");
			result.push(p);
			previous = p;
		}
		return result;
	}
</script>

{#if totalPages > 1}
	<div class="join mt-8 flex justify-center">
		<a
			href={makeHref(Math.max(1, currentPage - 1))}
			class="join-item btn"
			class:btn-disabled={currentPage === 1}
			aria-disabled={currentPage === 1}
		>
			«
		</a>
		{#each pageNumbers() as p, i (i)}
			{#if p === "…"}
				<span class="join-item btn btn-disabled">…</span>
			{:else}
				<a href={makeHref(p)} class="join-item btn {p === currentPage ? 'btn-active' : ''}">{p}</a>
			{/if}
		{/each}
		<a
			href={makeHref(Math.min(totalPages, currentPage + 1))}
			class="join-item btn"
			class:btn-disabled={currentPage === totalPages}
			aria-disabled={currentPage === totalPages}
		>
			»
		</a>
	</div>
{/if}
