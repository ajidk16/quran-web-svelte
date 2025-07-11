<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Number from '$lib/assets/svg/number.svg';
	import Badge from '$lib/components/ui/badge.svelte';
	import { BookOpenText, Box } from '@lucide/svelte';

	export let sort: string;
	export let name: string;
	export let name_short: string;
	export let translation: string;
	export let revelation: string;
	export let ayat: string;

	let className = '';
	export { className as class };
</script>

<main
	class={cn(
		'cursor-pointer w-full shadow bg-white flex justify-between items-center rounded-xl p-4 transition-transform duration-200 hover:scale-105 hover:shadow-lg',
		className
	)}
>
	<section class="flex gap-x-2">
		<div class="relative inline-block">
			<img src={Number} alt="number" class="block max-w-full h-auto" width="50" height="50" />
			<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<p class="text-sm font-bold text-black drop-shadow-lg p-2">{sort}</p>
			</div>
		</div>
		<div class="text-left">
			<span class="font-bold text-sm">{name}</span>
			<span class="text-xs text-primary">({translation})</span>
			<div class="flex gap-x-2 mt-1">
				<Badge text={revelation} size="sm" color="gray" icon={Box} />
				<Badge text={`${ayat} ayat`} size="sm" color="gray" icon={BookOpenText} />
			</div>
		</div>
	</section>
	<section class="text-lg font-bold text-black">{name_short}</section>
</main>
