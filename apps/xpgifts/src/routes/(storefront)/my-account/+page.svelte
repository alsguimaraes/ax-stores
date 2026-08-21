<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>My Account - xpgifts</title></svelte:head>

<h1 class="mb-1 text-2xl font-bold">Welcome back, {data.user.firstname}</h1>

<p class="mt-4 max-w-prose opacity-70">
	Use the menu on the left to manage your account.
</p>
