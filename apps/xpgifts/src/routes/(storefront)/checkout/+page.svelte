<script lang="ts">
	import { goto } from "$app/navigation";
	import { getCartContext } from "$lib/stores/cart-context";
	import { untrack } from "svelte";

	let { data } = $props();
	const cart = getCartContext();

	let step = $state<"shipping" | "payment" | "review">("shipping");
	let selectedAddressId = $state(
		untrack(() => data.addresses.find((a) => a.isDefault)?.id ?? data.addresses[0]?.id),
	);

	const subtotal = $derived(cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0));
	const shipping = $derived(cart.items.length > 0 ? 5.99 : 0);
	const total = $derived(subtotal + shipping);

	function placeOrder() {
		cart.clear();
		goto("/checkout/confirmation");
	}
</script>

<svelte:head><title>Checkout - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Checkout</h1>

<ul class="steps steps-horizontal mb-8 w-full">
	<li class="step step-primary">Shipping</li>
	<li class="step {step !== 'shipping' ? 'step-primary' : ''}">Payment</li>
	<li class="step {step === 'review' ? 'step-primary' : ''}">Review</li>
</ul>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
	<div class="lg:col-span-2">
		{#if step === "shipping"}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<h2 class="card-title">Shipping Address</h2>
					<div class="flex flex-col gap-2">
						{#each data.addresses as address (address.id)}
							<label class="border-base-300 flex cursor-pointer items-start gap-3 rounded-box border p-4">
								<input type="radio" name="address" class="radio mt-1" value={address.id} bind:group={selectedAddressId} />
								<div>
									<p class="font-medium">{address.label} {address.isDefault ? "(Default)" : ""}</p>
									<p class="text-sm opacity-70">{address.fullName}</p>
									<p class="text-sm opacity-70">
										{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}
										{address.postalCode}
									</p>
								</div>
							</label>
						{/each}
						<a href="/my-account/addresses/new" class="link text-sm">+ Add a new address</a>
					</div>
					<button class="btn btn-primary mt-4" onclick={() => (step = "payment")}>Continue to Payment</button>
				</div>
			</div>
		{:else if step === "payment"}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body gap-3">
					<h2 class="card-title">Payment Details</h2>
					<div>
						<label class="mb-1 block text-sm font-medium" for="card-number">Card Number</label>
						<input id="card-number" type="text" placeholder="4242 4242 4242 4242" class="input input-bordered w-full" />
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1 block text-sm font-medium" for="expiry">Expiry</label>
							<input id="expiry" type="text" placeholder="MM/YY" class="input input-bordered w-full" />
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium" for="cvc">CVC</label>
							<input id="cvc" type="text" placeholder="123" class="input input-bordered w-full" />
						</div>
					</div>
					<div class="mt-4 flex gap-2">
						<button class="btn" onclick={() => (step = "shipping")}>Back</button>
						<button class="btn btn-primary" onclick={() => (step = "review")}>Review Order</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<h2 class="card-title">Review Your Order</h2>
					{#if cart.items.length === 0}
						<p class="opacity-70">Your cart is empty - add something before placing an order.</p>
					{:else}
						<ul class="divide-base-200 divide-y">
							{#each cart.items as item (item.product.slug)}
								<li class="flex justify-between py-2 text-sm">
									<span>{item.product.title} × {item.quantity}</span>
									<span>${(item.product.price * item.quantity).toFixed(2)}</span>
								</li>
							{/each}
						</ul>
					{/if}
					<div class="mt-4 flex gap-2">
						<button class="btn" onclick={() => (step = "payment")}>Back</button>
						<button class="btn btn-primary" disabled={cart.items.length === 0} onclick={placeOrder}>Place Order</button>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="card bg-base-200">
		<div class="card-body">
			<h2 class="card-title">Order Summary</h2>
			<div class="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
			<div class="flex justify-between text-sm"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
			<div class="divider my-1"></div>
			<div class="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
		</div>
	</div>
</div>
