<script lang="ts">
	import EmptyState from "$lib/components/EmptyState.svelte";

	let { data } = $props();
</script>

<svelte:head><title>Addresses — xpgifts</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Address Book</h1>
	<a href="/my-account/addresses/new" class="btn btn-primary btn-sm">+ Add Address</a>
</div>

{#if data.addresses.length === 0}
	<EmptyState
		title="No saved addresses"
		description="Add an address to speed up checkout next time."
		actionHref="/my-account/addresses/new"
		actionLabel="Add Address"
	/>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#each data.addresses as address (address.id)}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body gap-1">
					<div class="flex items-center gap-2">
						<h2 class="card-title">{address.label}</h2>
						{#if address.isDefault}<span class="badge badge-primary badge-sm">Default</span>{/if}
					</div>
					<p class="text-sm">{address.fullName}</p>
					<p class="text-sm opacity-70">
						{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
						{address.city}, {address.state} {address.postalCode}<br />
						{address.country}
					</p>
					<p class="text-sm opacity-70">{address.phone}</p>
					<div class="card-actions mt-2">
						<a href="/my-account/addresses/{address.id}/edit" class="btn btn-sm">Edit</a>
						<button class="btn btn-ghost btn-sm">Delete</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
