<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>My Account - xpgifts</title></svelte:head>

<h1 class="mb-1 text-2xl font-bold">Welcome back, {data.user.firstname}</h1>

<p class="mt-4 max-w-prose opacity-70">
	Use the menu on the left to manage your account.
</p>
<ul>
	<li>Under <strong>Profile</strong> you can update your name and password.</li>
	<li><strong>Orders</strong> shows your order history and lets you track the status of each order.</li>
	<li><strong>Addresses</strong> is where you manage your shipping addresses.</li>
	<li><strong>Wishlist</strong> keeps track of products you've saved for later.</li>
</ul>
