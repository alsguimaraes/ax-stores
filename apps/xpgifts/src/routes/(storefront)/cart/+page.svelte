<script lang="ts">
	import { getCartContext } from "$lib/stores/cart-context";
	import EmptyState from "$lib/components/EmptyState.svelte";

	const cart = getCartContext();

	const subtotal = $derived(cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0));
</script>

<svelte:head><title>Cart - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Your Cart</h1>

{#if cart.items.length === 0}
	<EmptyState
		title="Your cart is empty"
		description="Looks like you haven't added anything yet."
		actionHref="/shop"
		actionLabel="Start Shopping"
	/>
{:else}
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="overflow-x-auto lg:col-span-2">
			<table class="table">
				<thead>
					<tr>
						<th>Product</th>
						<th>Price</th>
						<th>Quantity</th>
						<th>Total</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each cart.items as item (item.product.slug)}
						<tr>
							<td>
								<div class="flex items-center gap-3">
									<img src={item.product.images[0]} alt={item.product.title} class="h-14 w-14 rounded object-cover" />
									<a href="/product/{item.product.slug}" class="font-medium hover:underline">{item.product.title}</a>
								</div>
							</td>
							<td>${item.product.price.toFixed(2)}</td>
							<td>
								<div class="join">
									<button
										class="btn btn-xs join-item"
										onclick={() => cart.updateQuantity(item.product.slug, item.quantity - 1)}
										aria-label="Decrease quantity"
									>
										−
									</button>
									<span class="btn btn-xs join-item pointer-events-none w-8">{item.quantity}</span>
									<button
										class="btn btn-xs join-item"
										onclick={() => cart.updateQuantity(item.product.slug, item.quantity + 1)}
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>
							</td>
							<td>${(item.product.price * item.quantity).toFixed(2)}</td>
							<td><button class="btn btn-ghost btn-xs" onclick={() => cart.remove(item.product.slug)}>Remove</button></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title">Order Summary</h2>
				<div class="stat px-0">
					<div class="stat-title">Subtotal</div>
					<div class="stat-value text-2xl">${subtotal.toFixed(2)}</div>
				</div>
				<p class="text-sm opacity-70">Shipping and taxes calculated at checkout.</p>
				<a href="/checkout" class="btn btn-primary mt-4">Proceed to Checkout</a>
			</div>
		</div>
	</div>
{/if}
