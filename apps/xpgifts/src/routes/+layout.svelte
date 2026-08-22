<script lang="ts">
import { BProgress } from '@bprogress/core';
import { page } from '$app/state';
import '@bprogress/core/css';
import "./layout.css";
import { onMount } from 'svelte';
import { Toaster } from 'svelte-sonner';
import { afterNavigate, beforeNavigate } from '$app/navigation';

BProgress.configure({ showSpinner: false });
let { children } = $props();

let loadingTimeout: NodeJS.Timeout | null = null;
const genericDescription = 'xpgifts';
let description = $derived(page.data.description || genericDescription);
let title = $derived(page.data.title ? `${page.data.title} | xpgifts` : 'xpgifts');

onMount(async () => {
	document.documentElement.classList.remove('no-js');
	document.documentElement.classList.add('js');
});

beforeNavigate(() => {
	loadingTimeout = setTimeout(() => {
		BProgress.start();
	}, 500);
});

afterNavigate(() => {
	if (loadingTimeout) clearTimeout(loadingTimeout);
	BProgress.done();
});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="description" content={description} />
</svelte:head>

<Toaster />
<div class="root-layout">
	{@render children?.()}
</div>
