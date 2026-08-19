<script lang="ts">
	import type { OrderStatus } from "$lib/data/orders";

	let { status }: { status: OrderStatus } = $props();

	const styles: Record<OrderStatus, string> = {
		processing: "badge-warning",
		shipped: "badge-info",
		delivered: "badge-success",
		cancelled: "badge-error"
	};
</script>

<span class="badge {styles[status]} capitalize">{status}</span>
