<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import OrderStatusBadge from "$lib/components/OrderStatusBadge.svelte";

	let { data } = $props();

	const statusStepIndex: Record<string, number> = { processing: 0, shipped: 1, delivered: 2 };
	const currentStep = $derived(statusStepIndex[data.order.status] ?? -1);
</script>

<svelte:head><title>Order {data.order.id} - xpgifts</title></svelte:head>

<Breadcrumbs items={[{ label: "Orders", href: "/my-account/orders" }, { label: data.order.id }]} />

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Order {data.order.id}</h1>
	<OrderStatusBadge status={data.order.status} />
</div>

{#if data.order.status === "cancelled"}
	<div class="alert alert-error mb-6">
		<span>This order was cancelled.</span>
	</div>
{:else}
	<ul class="steps steps-horizontal mb-8 w-full">
		<li class="step {currentStep >= 0 ? 'step-primary' : ''}">Processing</li>
		<li class="step {currentStep >= 1 ? 'step-primary' : ''}">Shipped</li>
		<li class="step {currentStep >= 2 ? 'step-primary' : ''}">Delivered</li>
	</ul>
{/if}

<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
	<div class="overflow-x-auto lg:col-span-2">
		<table class="table">
			<thead>
				<tr>
					<th>Product</th>
					<th>Quantity</th>
					<th>Price</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				{#each data.order.items as item, i (i)}
					<tr>
						<td>
							{#if item.productSlug}
								<a href="/product/{item.productSlug}" class="flex items-center gap-3 hover:underline">
									{#if item.image}
										<img src={item.image} alt={item.name} class="h-12 w-12 rounded object-cover" />
									{/if}
									{item.name}
								</a>
							{:else}
								<span class="flex items-center gap-3">
									{#if item.image}
										<img src={item.image} alt={item.name} class="h-12 w-12 rounded object-cover" />
									{/if}
									{item.name}
								</span>
							{/if}
						</td>
						<td>{item.quantity}</td>
						<td>${item.price.toFixed(2)}</td>
						<td>${(item.price * item.quantity).toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="card bg-base-200">
		<div class="card-body gap-2">
			<h2 class="card-title">Summary</h2>
			<div class="flex justify-between text-sm"><span>Subtotal</span><span>${data.order.subtotal.toFixed(2)}</span></div>
			<div class="flex justify-between text-sm"><span>Shipping</span><span>${data.order.shipping.toFixed(2)}</span></div>
			<div class="divider my-1"></div>
			<div class="flex justify-between font-semibold"><span>Total</span><span>${data.order.total.toFixed(2)}</span></div>
			<div class="divider my-1"></div>
			<h3 class="text-sm font-medium">Shipping Address</h3>
			<p class="text-sm opacity-70">{data.order.shippingAddress}</p>
		</div>
	</div>
</div>
