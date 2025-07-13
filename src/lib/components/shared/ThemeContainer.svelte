<script lang="ts">
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { cn } from '$lib/utils';

	const {
		element = 'div',
		variant = 'primary',
		className = '',
		...restProps
	}: {
		element?: keyof HTMLElementTagNameMap;
		variant?: 'primary' | 'secondary' | 'tertiary';
		className?: string;
		[key: string]: any;
	} = $props();

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));
	
	const bgClass = $derived({
		primary: themeClasses.bgPrimary,
		secondary: themeClasses.bgSecondary,
		tertiary: themeClasses.bgTertiary
	}[variant]);

	const textClass = $derived(themeClasses.textPrimary);
</script>

<svelte:element 
	this={element} 
	class={cn(bgClass, textClass, className)}
	{...restProps}
>
	<slot />
</svelte:element>
