<script lang="ts">
	import { enhance } from "$app/forms";

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head><title>Create an Account - xpgifts</title></svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3">
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
			<div>
				<label class="mb-1 block text-sm font-medium" for="name">Full Name</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					value={form?.name ?? ""}
					placeholder="Jamie Rivera"
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={form?.email ?? ""}
					placeholder="you@example.com"
					class="input input-bordered w-full"
				/>
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
			<button type="submit" class="btn btn-primary mt-2 w-full" disabled={loading}>
				{loading ? "Creating account..." : "Create Account"}
			</button>
		</form>
		<div class="divider text-xs">OR</div>
		<p class="text-center text-sm">
			Already have an account? <a href="/login" class="link link-primary">Log in</a>
		</p>
	</div>
</div>
