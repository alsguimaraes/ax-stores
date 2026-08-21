<script lang="ts">
	import { page } from "$app/state";

	const links = [
		{ href: "/my-account/profile", label: "Profile" },
		{ href: "/my-account/orders", label: "Orders" },
		{ href: "/my-account/addresses", label: "Addresses" }
	];
</script>

<ul class="menu bg-base-100 rounded-box w-full shrink-0 lg:w-56">
	{#each links as link (link.href)}
		<li>
			<a href={link.href} class={page.url.pathname === link.href ? "menu-active" : ""}>{link.label}</a>
		</li>
	{/each}
	<li class="border-base-200 mt-2 border-t pt-2">
		<form method="POST" action="/logout">
			<button type="submit" class="btn btn-ghost btn-sm w-full justify-start px-3">Logout</button>
		</form>
	</li>
</ul>
