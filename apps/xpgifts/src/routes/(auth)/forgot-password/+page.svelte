<svelte:head><title>Forgot Password — xpgifts</title></svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3">
		<h1 class="card-title">Reset Your Password</h1>
		<p class="text-sm opacity-70">Enter your email and we'll send you a link to reset your password.</p>
		<div>
			<label class="mb-1 block text-sm font-medium" for="email">Email</label>
			<input id="email" type="email" placeholder="you@example.com" class="input input-bordered w-full" />
		</div>
		<button class="btn btn-primary mt-2">Send Reset Link</button>
		<p class="text-center text-sm">
			<a href="/login" class="link link-primary">Back to log in</a>
		</p>
	</div>
</div>
