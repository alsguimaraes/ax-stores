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
		<form method="POST" action="/logout" class="contents">
			<button
				type="submit"
				class="rounded-field hover:bg-base-content/10 flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-start transition-colors"
			>
				Logout
			</button>
		</form>
	</li>
</ul>
