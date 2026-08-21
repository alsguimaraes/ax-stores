<script lang="ts">
	import { enhance } from "$app/forms";

	let { form } = $props();
</script>

<svelte:head><title>Log In - xpgifts</title></svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3">
		<h1 class="card-title">Log In</h1>
		{#if form?.error}
			<p class="text-error text-sm">{form.error}</p>
		{/if}
		<form method="POST" use:enhance class="contents">
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
				<div class="mb-1 flex items-center justify-between">
					<label class="block text-sm font-medium" for="password">Password</label>
					<a href="/forgot-password" class="link text-xs">Forgot password?</a>
				</div>
				<input
					id="password"
					name="password"
					type="password"
					required
					placeholder="••••••••"
					class="input input-bordered w-full"
				/>
			</div>
			<button type="submit" class="btn btn-primary mt-2 w-full">Log In</button>
		</form>
		<div class="divider text-xs">OR</div>
		<p class="text-center text-sm">
			Don't have an account? <a href="/register" class="link link-primary">Sign up</a>
		</p>
	</div>
</div>
