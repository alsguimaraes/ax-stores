<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>Addresses - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Address Book</h1>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body gap-1">
			<h2 class="card-title">Billing Address</h2>
			<p class="text-sm">{data.addresses.billing.firstName} {data.addresses.billing.lastName}</p>
			{#if data.addresses.billing.company}
				<p class="text-sm opacity-70">{data.addresses.billing.company}</p>
			{/if}
			<p class="text-sm opacity-70">
				{data.addresses.billing.line1}{data.addresses.billing.line2
					? `, ${data.addresses.billing.line2}`
					: ""}<br />
				{data.addresses.billing.city}, {data.addresses.billing.state}
				{data.addresses.billing.postalCode}<br />
				{data.addresses.billing.country}
			</p>
			{#if data.addresses.billing.phone}
				<p class="text-sm opacity-70">{data.addresses.billing.phone}</p>
			{/if}
			{#if data.addresses.billing.email}
				<p class="text-sm opacity-70">{data.addresses.billing.email}</p>
			{/if}
			<div class="card-actions mt-2">
				<a href="/my-account/addresses/billing/edit" class="btn btn-sm">Edit</a>
			</div>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="card-body gap-1">
			<h2 class="card-title">Shipping Address</h2>
			<p class="text-sm">{data.addresses.shipping.firstName} {data.addresses.shipping.lastName}</p>
			{#if data.addresses.shipping.company}
				<p class="text-sm opacity-70">{data.addresses.shipping.company}</p>
			{/if}
			<p class="text-sm opacity-70">
				{data.addresses.shipping.line1}{data.addresses.shipping.line2
					? `, ${data.addresses.shipping.line2}`
					: ""}<br />
				{data.addresses.shipping.city}, {data.addresses.shipping.state}
				{data.addresses.shipping.postalCode}<br />
				{data.addresses.shipping.country}
			</p>
			{#if data.addresses.shipping.phone}
				<p class="text-sm opacity-70">{data.addresses.shipping.phone}</p>
			{/if}
			<div class="card-actions mt-2">
				<a href="/my-account/addresses/shipping/edit" class="btn btn-sm">Edit</a>
			</div>
		</div>
	</div>
</div>
