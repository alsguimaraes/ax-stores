<script lang="ts">
	import { page } from "$app/state";
	import type { Category } from "$lib/data/categories";
	import { getCartContext } from "$lib/stores/cart-context";
	import CartIcon from "./CartIcon.svelte";
	import MenuIcon from "./MenuIcon.svelte";
	import UserIcon from "./UserIcon.svelte";

	let { categories }: { categories: Category[] } = $props();
	const cart = getCartContext();

	let searchQuery = $state(page.url.searchParams.get("q") ?? "");
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-30">
	<div class="navbar-start">
		<div class="dropdown lg:hidden">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle" aria-label="Open menu">
				<MenuIcon />
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-30 mt-3 w-56 p-2 shadow">
				{#each categories as category (category.slug)}
					<li><a href="/product-category/{category.slug}">{category.title}</a></li>
				{/each}
				<li><a href="/theme">Shop by Theme</a></li>
			</ul>
		</div>
		<a href="/" rel="home"><img width="120" height="40" decoding="async" loading="eager" src="/xpgifts-logo.png" alt="xpgifts.com"></a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			{#each categories as category (category.slug)}
				<li><a href="/product-category/{category.slug}">{category.title}</a></li>
			{/each}
			<li><a href="/theme">Shop by Theme</a></li>
		</ul>
	</div>

	<div class="navbar-end gap-1">
		<form action="/search" class="hidden sm:block">
			<input
				type="search"
				name="q"
				bind:value={searchQuery}
				placeholder="Search gifts..."
				class="input input-bordered input-sm w-40 md:w-56"
			/>
		</form>
		<a href="/my-account/profile" class="btn btn-ghost btn-circle" aria-label="Account">
			<UserIcon />
		</a>
		<a href="/cart" class="btn btn-ghost btn-circle" aria-label="Cart">
			<div class="indicator">
				<CartIcon />
				{#if cart.count > 0}
					<span class="badge badge-sm badge-primary indicator-item">{cart.count}</span>
				{/if}
			</div>
		</a>
	</div>
</div>
