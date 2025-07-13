<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Number from '$lib/assets/svg/number.svg';
	import Badge from '$lib/components/ui/badge.svelte';
	import { BookOpenText, Box } from '@lucide/svelte';

	export let sort: number;
	export let name: string;
	export let name_short: string;
	export let translation: string;
	export let revelation: string;
	export let ayat: number;

	let className = '';
	export { className as class };
</script>

<main
	class={cn(
		'cursor-pointer w-full shadow bg-white dark:bg-gray-800 flex justify-between items-center rounded-xl p-4 transition-transform duration-200 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700',
		className
	)}
>
	<section class="flex items-center gap-x-4">
		<div class="relative flex-shrink-0">
			<img src={Number} alt="number" class="block w-12 h-12" width="48" height="48" />
			<div class="absolute inset-0 flex items-center justify-center">
				<p class="text-base font-bold text-black dark:text-white drop-shadow p-1">{sort}</p>
			</div>
		</div>
		<div class="flex flex-col justify-center text-left">
			<span class="font-bold text-base text-black dark:text-white">{name}</span>
			<span class="text-xs text-primary dark:text-emerald-400 mt-0.5">({translation})</span>
			<div class="flex gap-x-2 mt-2">
				<Badge text={revelation} size="sm" color="gray" icon={Box} />
				<Badge text={`${ayat} ayat`} size="sm" color="gray" icon={BookOpenText} />
			</div>
		</div>
	</section>
	<section class="text-lg font-bold text-black dark:text-white">{name_short}</section>
</main>
