<script lang="ts">
	import { enhance } from "$app/forms";

	let { data, form } = $props();

	let billingLoading = $state(false);
	let shippingLoading = $state(false);

	let billingValues = $derived(form?.type === "billing" ? form.values : data.addresses.billing);
	let shippingValues = $derived(
		form?.type === "shipping" ? form.values : data.addresses.shipping,
	);
</script>

<svelte:head><title>Addresses - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Address Book</h1>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body gap-4">
			<h2 class="card-title">Billing Address</h2>
			{#if form?.type === "billing" && form.error}
				<p class="text-error text-sm">{form.error}</p>
			{/if}
			{#if form?.type === "billing" && form.success}
				<p class="text-success text-sm">Your billing address has been saved.</p>
			{/if}
			<form
				method="POST"
				action="?/billing"
				class="contents"
				use:enhance={() => {
					billingLoading = true;
					return async ({ update }) => {
						await update();
						billingLoading = false;
					};
				}}
			>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="billing-firstName">First Name</label>
						<input
							id="billing-firstName"
							name="firstName"
							type="text"
							required
							value={billingValues.firstName}
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium" for="billing-lastName">Last Name</label>
						<input
							id="billing-lastName"
							name="lastName"
							type="text"
							required
							value={billingValues.lastName}
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="billing-company">Company (optional)</label>
					<input
						id="billing-company"
						name="company"
						type="text"
						value={billingValues.company}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="billing-line1">Address Line 1</label>
					<input
						id="billing-line1"
						name="line1"
						type="text"
						required
						value={billingValues.line1}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="billing-line2">Address Line 2 (optional)</label>
					<input
						id="billing-line2"
						name="line2"
						type="text"
						value={billingValues.line2}
						class="input input-bordered w-full"
					/>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="billing-city">City</label>
						<input
							id="billing-city"
							name="city"
							type="text"
							required
							value={billingValues.city}
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium" for="billing-state">State</label>
						<input
							id="billing-state"
							name="state"
							type="text"
							required
							value={billingValues.state}
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="billing-postalCode">Postal Code</label>
						<input
							id="billing-postalCode"
							name="postalCode"
							type="text"
							required
							value={billingValues.postalCode}
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium" for="billing-country">Country</label>
						<input
							id="billing-country"
							name="country"
							type="text"
							required
							value={billingValues.country}
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="billing-phone">Phone (optional)</label>
					<input
						id="billing-phone"
						name="phone"
						type="tel"
						value={billingValues.phone}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="billing-email">Email</label>
					<input
						id="billing-email"
						name="email"
						type="email"
						required
						value={billingValues.email}
						class="input input-bordered w-full"
					/>
				</div>
				<button type="submit" class="btn btn-primary mt-2 self-start" disabled={billingLoading}>
					{billingLoading ? "Saving..." : "Save Changes"}
				</button>
			</form>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body gap-4">
			<h2 class="card-title">Shipping Address</h2>
			{#if form?.type === "shipping" && form.error}
				<p class="text-error text-sm">{form.error}</p>
			{/if}
			{#if form?.type === "shipping" && form.success}
				<p class="text-success text-sm">Your shipping address has been saved.</p>
			{/if}
			<form
				method="POST"
				action="?/shipping"
				class="contents"
				use:enhance={() => {
					shippingLoading = true;
					return async ({ update }) => {
						await update();
						shippingLoading = false;
					};
				}}
			>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="shipping-firstName">First Name</label>
						<input
							id="shipping-firstName"
							name="firstName"
							type="text"
							required
							value={shippingValues.firstName}
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium" for="shipping-lastName">Last Name</label>
						<input
							id="shipping-lastName"
							name="lastName"
							type="text"
							required
							value={shippingValues.lastName}
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="shipping-company">Company (optional)</label>
					<input
						id="shipping-company"
						name="company"
						type="text"
						value={shippingValues.company}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="shipping-line1">Address Line 1</label>
					<input
						id="shipping-line1"
						name="line1"
						type="text"
						required
						value={shippingValues.line1}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="shipping-line2">Address Line 2 (optional)</label>
					<input
						id="shipping-line2"
						name="line2"
						type="text"
						value={shippingValues.line2}
						class="input input-bordered w-full"
					/>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="shipping-city">City</label>
						<input
							id="shipping-city"
							name="city"
							type="text"
							required
							value={shippingValues.city}
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium" for="shipping-state">State</label>
						<input
							id="shipping-state"
							name="state"
							type="text"
							required
							value={shippingValues.state}
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium" for="shipping-postalCode">Postal Code</label>
						<input
							id="shipping-postalCode"
							name="postalCode"
							type="text"
							required
							value={shippingValues.postalCode}
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium" for="shipping-country">Country</label>
						<input
							id="shipping-country"
							name="country"
							type="text"
							required
							value={shippingValues.country}
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="shipping-phone">Phone (optional)</label>
					<input
						id="shipping-phone"
						name="phone"
						type="tel"
						value={shippingValues.phone}
						class="input input-bordered w-full"
					/>
				</div>
				<button type="submit" class="btn btn-primary mt-2 self-start" disabled={shippingLoading}>
					{shippingLoading ? "Saving..." : "Save Changes"}
				</button>
			</form>
		</div>
	</div>
</div>
