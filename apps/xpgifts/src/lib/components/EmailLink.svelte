<script lang="ts">
	let {
		email = "support@xpgifts.com",
		class: className = "link",
	}: { email?: string; class?: string } = $props();
</script>

<a href="mailto:{email}" class={className}>{email}</a>
