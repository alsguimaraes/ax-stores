<script lang="ts">
	import { page } from "$app/state";
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
	<div class="text-6xl">🎁</div>
	<h1 class="text-3xl font-bold">{page.status}</h1>
	<p class="max-w-sm opacity-70">
		{page.error?.message ?? "Something went wrong."}
	</p>
	<a href="/" class="btn btn-primary">Back to Home</a>
</div>
