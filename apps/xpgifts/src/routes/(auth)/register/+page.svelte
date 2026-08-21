<script lang="ts">
	import { untrack } from "svelte";
	import { enhance } from "$app/forms";

	let { form } = $props();
	let loading = $state(false);
	let email = $state(untrack(() => form?.email ?? ""));
	let confirmEmail = $state("");
	let emailsMismatch = $derived(confirmEmail.length > 0 && email !== confirmEmail);
</script>

<svelte:head><title>Create an Account - xpgifts</title></svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3">
		{#if form?.pendingVerification}
			<h1 class="card-title">Check your email</h1>
			<p class="text-sm opacity-70">
				We've sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your
				account, then log in.
			</p>
			<a href="/login" class="btn btn-primary mt-2 w-full">Go to Log In</a>
		{:else}
			<h1 class="card-title">Create an Account</h1>
			{#if form?.error}
				<p class="text-error text-sm">{form.error}</p>
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
						<label class="mb-1 block text-sm font-medium" for="firstName">First Name</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							required
							value={form?.firstName ?? ""}
							placeholder="Jamie"
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
							value={form?.lastName ?? ""}
							placeholder="Rivera"
							class="input input-bordered w-full"
						/>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						bind:value={email}
						placeholder="you@example.com"
						class="input input-bordered w-full"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="confirmEmail">Confirm Email</label>
					<input
						id="confirmEmail"
						name="confirmEmail"
						type="email"
						required
						bind:value={confirmEmail}
						placeholder="you@example.com"
						class="input input-bordered w-full"
						class:input-error={emailsMismatch}
					/>
					{#if emailsMismatch}
						<p class="text-error mt-1 text-xs">Emails do not match.</p>
					{/if}
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						placeholder="••••••••"
						class="input input-bordered w-full"
					/>
				</div>
				<button
					type="submit"
					class="btn btn-primary mt-2 w-full"
					disabled={loading || emailsMismatch || !confirmEmail}
				>
					{loading ? "Creating account..." : "Create Account"}
				</button>
			</form>
			<div class="divider text-xs">OR</div>
			<p class="text-center text-sm">
				Already have an account? <a href="/login" class="link link-primary">Log in</a>
			</p>
		{/if}
	</div>
</div>
