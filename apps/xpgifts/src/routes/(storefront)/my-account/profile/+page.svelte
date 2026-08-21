<script lang="ts">
	import { enhance } from "$app/forms";
	import UserIcon from "$lib/components/UserIcon.svelte";

	let { data, form } = $props();

	let loading = $state(false);
	let password = $state("");
	let confirmPassword = $state("");
	let passwordsMismatch = $derived(
		password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword,
	);
	let passwordIncomplete = $derived(
		(password.length > 0 || confirmPassword.length > 0) &&
			(password.length === 0 || confirmPassword.length === 0),
	);
	let canSubmit = $derived(!loading && !passwordsMismatch && !passwordIncomplete);
</script>

<svelte:head><title>Profile - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Account Details</h1>

<div class="card bg-base-100 max-w-lg shadow-sm">
	<div class="card-body gap-4">
		<div class="flex items-center gap-4">
			<div class="avatar">
				<div class="bg-base-200 flex w-16 items-center justify-center rounded-full">
					<UserIcon class="h-8 w-8" />
				</div>
			</div>
			<div>
				<p class="font-medium">{data.user.firstname} {data.user.lastname}</p>
				<p class="text-sm opacity-70">{data.user.email}</p>
			</div>
		</div>

		{#if form?.error}
			<p class="text-error text-sm">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="text-success text-sm">Your changes have been saved.</p>
		{/if}

		<form
			method="POST"
			class="contents"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					if (result.type === "success") {
						password = "";
						confirmPassword = "";
					}
					loading = false;
				};
			}}
		>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="mb-1 block text-sm font-medium" for="firstName">First Name</label>
					<input
						id="firstName"
						name="firstName"
						type="text"
						required
						value={form?.firstName ?? data.user.firstname}
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="lastName">Last Name</label>
					<input
						id="lastName"
						name="lastName"
						type="text"
						required
						value={form?.lastName ?? data.user.lastname}
						class="input input-bordered w-full"
					/>
				</div>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="email">Email</label>
				<input
					id="email"
					type="email"
					value={data.user.email}
					disabled
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="password">New Password</label>
				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					placeholder="Leave blank to keep current password"
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="confirmPassword">Confirm New Password</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					placeholder="Leave blank to keep current password"
					class="input input-bordered w-full"
					class:input-error={passwordsMismatch}
				/>
				{#if passwordsMismatch}
					<p class="text-error mt-1 text-xs">Passwords do not match.</p>
				{/if}
			</div>
			<button type="submit" class="btn btn-primary mt-2 self-start" disabled={!canSubmit}>
				{loading ? "Saving..." : "Save Changes"}
			</button>
		</form>
	</div>
</div>
