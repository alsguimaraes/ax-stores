<script lang="ts">
	import AccountSidebar from "$lib/components/AccountSidebar.svelte";

	let { children } = $props();
</script>

<div class="flex flex-col gap-8 lg:flex-row">
	<AccountSidebar />
	<div class="flex-1">
		{@render children()}
	</div>
</div>
