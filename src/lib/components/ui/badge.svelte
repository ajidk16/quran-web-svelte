<script lang="ts">
	import { currentTheme, themeUtils } from '$lib/utils/theme';

	type BadgeColor = 'blue' | 'gray' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink';
	type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
	type BadgeRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'full';

	const {
		text = 'Badge',
		color = 'blue',
		rounded = 'md',
		size = 'xs',
		className = '',
		icon = undefined
	}: {
		text?: string;
		color?: BadgeColor;
		rounded?: BadgeRounded;
		size?: BadgeSize;
		className?: string;
		icon?: any;
	} = $props();

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

	const colorClasses = $derived({
		blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
		gray: `${themeClasses.bgSecondary} ${themeClasses.textSecondary}`,
		red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
		green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
		yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
		indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
		purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
		pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
	});

	const sizeClasses: Record<BadgeSize, string> = {
		xs: 'text-xs px-1 py-0.5',
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-2.5 py-0.5',
		lg: 'text-base px-3 py-1'
	};

	const roundedClasses: Record<BadgeRounded, string> = {
		none: 'rounded-none',
		xs: 'rounded-xs',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full'
	};
</script>

<span
	class="inline-flex items-center gap-2 font-medium {colorClasses[color]} {sizeClasses[
		size
	]} {roundedClasses[rounded]} {className}"
>
	{#if icon}
		<svelte:component this={icon} size={16} />
	{/if}
	{text}
</span>
