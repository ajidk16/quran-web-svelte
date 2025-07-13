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

<div class="text-center p-4 rounded-lg {style} border border-gray-200 dark:border-gray-700">
	<h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">{name}</h3>
	<p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{time}</p>
	{#if isCurrent}
		<p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Sekarang</p>
	{:else if isNext}
		<p class="text-xs text-blue-600 dark:text-blue-400 mt-1">Selanjutnya</p>
	{/if}
</div>
