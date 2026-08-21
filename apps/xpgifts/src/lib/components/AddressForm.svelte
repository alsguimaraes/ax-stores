<script lang="ts">
	import { enhance } from "$app/forms";
	import type { AddressFormValues } from "$lib/server/addressForm";

	let {
		values,
		error,
		success,
		showEmail = false,
		idPrefix,
	}: {
		values: AddressFormValues;
		error?: string;
		success?: boolean;
		showEmail?: boolean;
		idPrefix: string;
	} = $props();

	let loading = $state(false);
</script>

<div class="card bg-base-100 max-w-lg shadow-sm">
	<div class="card-body gap-4">
		{#if error}
			<p class="text-error text-sm">{error}</p>
		{/if}
		{#if success}
			<p class="text-success text-sm">Your address has been saved.</p>
		{/if}
		<form
			method="POST"
			class="contents"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-firstName">First Name</label>
					<input
						id="{idPrefix}-firstName"
						name="firstName"
						type="text"
						required
						value={values.firstName}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-lastName">Last Name</label>
					<input
						id="{idPrefix}-lastName"
						name="lastName"
						type="text"
						required
						value={values.lastName}
						class="input input-bordered w-full"
					/>
				</div>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="{idPrefix}-company">Company (optional)</label>
				<input
					id="{idPrefix}-company"
					name="company"
					type="text"
					value={values.company}
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="{idPrefix}-line1">Address Line 1</label>
				<input
					id="{idPrefix}-line1"
					name="line1"
					type="text"
					required
					value={values.line1}
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="{idPrefix}-line2">Address Line 2 (optional)</label>
				<input
					id="{idPrefix}-line2"
					name="line2"
					type="text"
					value={values.line2}
					class="input input-bordered w-full"
				/>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-city">City</label>
					<input
						id="{idPrefix}-city"
						name="city"
						type="text"
						required
						value={values.city}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-state">State</label>
					<input
						id="{idPrefix}-state"
						name="state"
						type="text"
						required
						value={values.state}
						class="input input-bordered w-full"
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-postalCode">Postal Code</label>
					<input
						id="{idPrefix}-postalCode"
						name="postalCode"
						type="text"
						required
						value={values.postalCode}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-country">Country</label>
					<input
						id="{idPrefix}-country"
						name="country"
						type="text"
						required
						value={values.country}
						class="input input-bordered w-full"
					/>
				</div>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="{idPrefix}-phone">Phone (optional)</label>
				<input
					id="{idPrefix}-phone"
					name="phone"
					type="tel"
					value={values.phone}
					class="input input-bordered w-full"
				/>
			</div>
			{#if showEmail}
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-email">Email</label>
					<input
						id="{idPrefix}-email"
						name="email"
						type="email"
						required
						value={values.email}
						class="input input-bordered w-full"
					/>
				</div>
			{/if}
			<div class="mt-2 flex gap-2">
				<a href="/my-account/addresses" class="btn">Cancel</a>
				<button type="submit" class="btn btn-primary" disabled={loading}>
					{loading ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</form>
	</div>
</div>
