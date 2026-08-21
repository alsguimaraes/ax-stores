<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>Edit Address - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Edit Address</h1>

<div class="card bg-base-100 max-w-lg shadow-sm">
	<div class="card-body gap-4">
		<div>
			<label class="mb-1 block text-sm font-medium" for="label">Label</label>
			<input id="label" type="text" value={data.address.label} class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="full-name">Full Name</label>
			<input id="full-name" type="text" value={data.address.fullName} class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="line1">Address Line 1</label>
			<input id="line1" type="text" value={data.address.line1} class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="line2">Address Line 2 (optional)</label>
			<input id="line2" type="text" value={data.address.line2 ?? ""} class="input input-bordered w-full" />
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="mb-1 block text-sm font-medium" for="city">City</label>
				<input id="city" type="text" value={data.address.city} class="input input-bordered w-full" />
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="state">State</label>
				<input id="state" type="text" value={data.address.state} class="input input-bordered w-full" />
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="mb-1 block text-sm font-medium" for="postal-code">Postal Code</label>
				<input id="postal-code" type="text" value={data.address.postalCode} class="input input-bordered w-full" />
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="phone">Phone</label>
				<input id="phone" type="tel" value={data.address.phone} class="input input-bordered w-full" />
			</div>
		</div>
		<label class="flex items-center gap-2 text-sm">
			<input type="checkbox" class="checkbox checkbox-sm" checked={data.address.isDefault} />
			Set as default address
		</label>
		<div class="mt-2 flex gap-2">
			<a href="/my-account/addresses" class="btn">Cancel</a>
			<button class="btn btn-primary">Save Changes</button>
		</div>
	</div>
</div>
