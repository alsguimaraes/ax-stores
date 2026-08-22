<script lang="ts">
	import AddressForm from "$lib/components/AddressForm.svelte";
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";

	let { data, form } = $props();

	let values = $derived(form?.values ?? data.address);
</script>

<svelte:head><title>Edit Billing Address - xpgifts</title></svelte:head>

<Breadcrumbs
	items={[{ label: "Addresses", href: "/my-account/addresses" }, { label: "Edit Billing Address" }]}
/>

<h1 class="mb-6 text-2xl font-bold">Edit Billing Address</h1>

<AddressForm
	{values}
	error={form?.error}
	success={form?.success}
	showEmail
	idPrefix="billing"
	countries={data.countries}
/>
