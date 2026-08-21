<svelte:head><title>Create an Account - xpgifts</title></svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3">
		<h1 class="card-title">Create an Account</h1>
		<div>
			<label class="mb-1 block text-sm font-medium" for="name">Full Name</label>
			<input id="name" type="text" placeholder="Jamie Rivera" class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="email">Email</label>
			<input id="email" type="email" placeholder="you@example.com" class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="password">Password</label>
			<input id="password" type="password" placeholder="••••••••" class="input input-bordered w-full" />
		</div>
		<button class="btn btn-primary mt-2">Create Account</button>
		<div class="divider text-xs">OR</div>
		<p class="text-center text-sm">
			Already have an account? <a href="/login" class="link link-primary">Log in</a>
		</p>
	</div>
</div>
