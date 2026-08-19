<script lang="ts">
	import OrderStatusBadge from "$lib/components/OrderStatusBadge.svelte";

	let { data } = $props();
</script>

<svelte:head><title>My Account — xpgifts</title></svelte:head>

<h1 class="mb-1 text-2xl font-bold">Welcome back, {data.user.name.split(" ")[0]}</h1>
<p class="mb-6 opacity-70">Here's what's happening with your account.</p>

<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
	<div class="stat bg-base-100 rounded-box shadow-sm">
		<div class="stat-title">Recent Orders</div>
		<div class="stat-value text-2xl">{data.recentOrders.length}</div>
		<div class="stat-desc"><a href="/my-account/orders" class="link">View all orders</a></div>
	</div>
	<div class="stat bg-base-100 rounded-box shadow-sm">
		<div class="stat-title">Saved Addresses</div>
		<div class="stat-value text-2xl">{data.addressCount}</div>
		<div class="stat-desc"><a href="/my-account/addresses" class="link">Manage addresses</a></div>
	</div>
</div>

<h2 class="mb-4 text-lg font-bold">Recent Orders</h2>
<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Order</th>
				<th>Date</th>
				<th>Status</th>
				<th>Total</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.recentOrders as order (order.id)}
				<tr>
					<td class="font-mono">{order.id}</td>
					<td>{order.placedAt}</td>
					<td><OrderStatusBadge status={order.status} /></td>
					<td>${order.total.toFixed(2)}</td>
					<td><a href="/my-account/orders/{order.id}" class="link text-sm">View</a></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
