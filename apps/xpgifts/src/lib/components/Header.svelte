<script lang="ts">
	import { page } from "$app/state";
	import type { Category } from "$lib/data/categories";
	import { getCartContext } from "$lib/stores/cart-context";

	let { categories }: { categories: Category[] } = $props();
	const cart = getCartContext();

	let searchQuery = $state(page.url.searchParams.get("q") ?? "");
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-30">
	<div class="navbar-start">
		<div class="dropdown lg:hidden">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle" aria-label="Open menu">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-30 mt-3 w-56 p-2 shadow">
				{#each categories as category (category.slug)}
					<li><a href="/product-category/{category.slug}">{category.name}</a></li>
				{/each}
				<li><a href="/theme">Shop by Theme</a></li>
			</ul>
		</div>
		<a href="/" rel="home"><img width="120" height="40" decoding="async" loading="lazy" src="%sveltekit.assets%/xpgifts-logo.png" alt="xpgifts.com"></a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			{#each categories as category (category.slug)}
				<li><a href="/product-category/{category.slug}">{category.name}</a></li>
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
		<a href="/my-account" class="btn btn-ghost btn-circle" aria-label="Account">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
				/>
			</svg>
		</a>
		<a href="/cart" class="btn btn-ghost btn-circle" aria-label="Cart">
			<div class="indicator">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
				{#if cart.count > 0}
					<span class="badge badge-sm badge-primary indicator-item">{cart.count}</span>
				{/if}
			</div>
		</a>
	</div>
</div>
