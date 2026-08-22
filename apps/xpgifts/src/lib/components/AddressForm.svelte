<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Country } from "$lib/data/countries";
	import type { AddressFormValues } from "$lib/server/addressForm";

	let {
		values,
		error,
		success,
		showEmail = false,
		idPrefix,
		countries,
	}: {
		values: AddressFormValues;
		error?: string;
		success?: boolean;
		showEmail?: boolean;
		idPrefix: string;
		countries: Country[];
	} = $props();

	let loading = $state(false);

	// Tracks the country input's live value so the state datalist can narrow
	// to that country's states (e.g. US) - empty for countries WC has no
	// states list for, which just leaves the state input's datalist empty.
	// Without a user override yet, falls back to `values` so it's correct on
	// first render (including SSR) and stays correct if `values` changes
	// later (e.g. re-rendered with submitted values after a validation error).
	let countryOverride: string | undefined = $state(undefined);
	let selectedCountry = $derived(countryOverride ?? values.country);
	let currentStates = $derived(
		countries.find((country) => country.code === selectedCountry)?.states ?? [],
	);
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
					// Fields use one-way `value={...}` bindings, not `bind:value`, so
					// their DOM defaultValue is whatever was there at first mount
					// (often blank, for a customer with no address on file yet).
					// enhance()'s default success behavior calls form.reset(), which
					// would wipe the just-saved values back to that stale default -
					// reset: false keeps the submitted values on screen.
					await update({ reset: false });
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
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-country">Country</label>
					<select
						id="{idPrefix}-country"
						name="country"
						required
						value={selectedCountry}
						onchange={(event) => (countryOverride = event.currentTarget.value)}
						class="select select-bordered w-full"
					>
						<option value="" disabled>Select a country</option>
						{#each countries as country (country.code)}
							<option value={country.code}>{country.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="{idPrefix}-state">State / County</label>
					<input
						id="{idPrefix}-state"
						name="state"
						type="text"
						list="{idPrefix}-state-options"
						required
						value={values.state}
						class="input input-bordered w-full"
					/>
					<datalist id="{idPrefix}-state-options">
						{#each currentStates as state (state.code)}
							<option value={state.name}></option>
						{/each}
					</datalist>
				</div>
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
