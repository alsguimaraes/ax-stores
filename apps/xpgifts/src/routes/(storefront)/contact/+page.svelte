<svelte:head><title>Contact Us — xpgifts</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Contact Us</h1>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
	<div class="card bg-base-100 shadow-sm lg:col-span-2">
		<div class="card-body gap-4">
			<div>
				<label class="mb-1 block text-sm font-medium" for="name">Name</label>
				<input id="name" type="text" class="input input-bordered w-full" />
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="email">Email</label>
				<input id="email" type="email" class="input input-bordered w-full" />
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="subject">Subject</label>
				<input id="subject" type="text" class="input input-bordered w-full" />
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium" for="message">Message</label>
				<textarea id="message" rows="5" class="textarea textarea-bordered w-full"></textarea>
			</div>
			<button class="btn btn-primary self-start">Send Message</button>
		</div>
	</div>

	<div class="card bg-base-200">
		<div class="card-body gap-2">
			<h2 class="card-title">Get in Touch</h2>
			<p class="text-sm opacity-70">support@xpgifts.com</p>
			<p class="text-sm opacity-70">Mon–Fri, 9am–5pm ET</p>
			<div class="divider my-1"></div>
			<p class="text-sm">Have a question about an order? Visit <a href="/help" class="link">Help / FAQ</a> first — you might find a quick answer.</p>
		</div>
	</div>
</div>
