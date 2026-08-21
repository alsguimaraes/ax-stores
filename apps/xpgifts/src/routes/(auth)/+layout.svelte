<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4 py-12">
	<a href="/" rel="home"><img width="120" height="40" decoding="async" loading="eager" src="/xpgifts-logo.png" alt="xpgifts.com"></a>
	<div class="w-full max-w-md">
		{@render children()}
	</div>
</div>
