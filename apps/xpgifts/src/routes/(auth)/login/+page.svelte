<svelte:head><title>Log In - xpgifts</title></svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3">
		<h1 class="card-title">Log In</h1>
		<div>
			<label class="mb-1 block text-sm font-medium" for="email">Email</label>
			<input id="email" type="email" placeholder="you@example.com" class="input input-bordered w-full" />
		</div>
		<div>
			<div class="mb-1 flex items-center justify-between">
				<label class="block text-sm font-medium" for="password">Password</label>
				<a href="/forgot-password" class="link text-xs">Forgot password?</a>
			</div>
			<input id="password" type="password" placeholder="••••••••" class="input input-bordered w-full" />
		</div>
		<button class="btn btn-primary mt-2">Log In</button>
		<div class="divider text-xs">OR</div>
		<p class="text-center text-sm">
			Don't have an account? <a href="/register" class="link link-primary">Sign up</a>
		</p>
	</div>
</div>
