<script lang="ts">
	import OrderStatusBadge from "$lib/components/OrderStatusBadge.svelte";
	import EmptyState from "$lib/components/EmptyState.svelte";

	let { data } = $props();
</script>

<svelte:head><title>Order History - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Order History</h1>

{#if data.orders.length === 0}
	<EmptyState title="No orders yet" description="Your past orders will show up here." actionHref="/shop" actionLabel="Start Shopping" />
{:else}
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr>
					<th>Order</th>
					<th>Date</th>
					<th>Status</th>
					<th>Items</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				{#each data.orders as order (order.id)}
					<tr>
						<td class="font-mono"><a href="/my-account/orders/{order.id}" class="link text-sm">{order.id}</a></td>
						<td>{order.placedAt}</td>
						<td><OrderStatusBadge status={order.status} /></td>
						<td>{order.items.reduce((n, i) => n + i.quantity, 0)}</td>
						<td>${order.total.toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
