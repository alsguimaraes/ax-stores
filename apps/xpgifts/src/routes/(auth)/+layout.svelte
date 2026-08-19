<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4 py-12">
	<a href="/" class="mb-6 text-2xl font-bold">xpgifts</a>
	<div class="w-full max-w-md">
		{@render children()}
	</div>
</div>
