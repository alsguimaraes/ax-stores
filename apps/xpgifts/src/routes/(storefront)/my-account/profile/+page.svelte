<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>Profile - xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Account Details</h1>

<div class="card bg-base-100 max-w-lg shadow-sm">
	<div class="card-body gap-4">
		<div class="flex items-center gap-4">
			<div class="avatar">
				<div class="w-16 rounded-full">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
				</div>
			</div>
			<div>
				<p class="font-medium">{data.user.name}</p>
				<p class="text-sm opacity-70">{data.user.email}</p>
			</div>
		</div>

		<div>
			<label class="mb-1 block text-sm font-medium" for="name">Full Name</label>
			<input id="name" type="text" value={data.user.name} class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="email">Email</label>
			<input id="email" type="email" value={data.user.email} class="input input-bordered w-full" />
		</div>
		<div>
			<label class="mb-1 block text-sm font-medium" for="password">New Password</label>
			<input id="password" type="password" placeholder="Leave blank to keep current password" class="input input-bordered w-full" />
		</div>
		<button class="btn btn-primary mt-2 self-start">Save Changes</button>
	</div>
</div>
