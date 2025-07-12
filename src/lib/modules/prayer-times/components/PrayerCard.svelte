<script lang="ts">
	interface Props {
		name: string;
		time: string;
		isCurrent?: boolean;
		isNext?: boolean;
		style?: string;
	}

	let { name, time, isCurrent = false, isNext = false, style = 'bg-gray-50' }: Props = $props();
</script>

<div class="text-center p-4 rounded-lg {style}">
	<h3 class="font-semibold text-gray-700 mb-1">{name}</h3>
	<p class="text-2xl font-bold text-emerald-600">{time}</p>
	{#if isCurrent}
		<p class="text-xs text-emerald-600 mt-1">Sekarang</p>
	{:else if isNext}
		<p class="text-xs text-blue-600 mt-1">Selanjutnya</p>
	{/if}
</div>
