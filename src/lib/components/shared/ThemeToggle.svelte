<script lang="ts">
	import { Sun, Moon, Monitor } from '@lucide/svelte';
	import { selectedTheme, currentTheme, type Theme } from '$lib/utils/theme';
	import { t } from '$lib/utils/i18n';
	import { cn } from '$lib/utils';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
	}

	const { size = 'md', showLabel = false }: Props = $props();

	const themes: { value: Theme; icon: any; label: string }[] = [
		{ value: 'light', icon: Sun, label: 'settings.theme.light' },
		{ value: 'dark', icon: Moon, label: 'settings.theme.dark' },
		{ value: 'system', icon: Monitor, label: 'settings.theme.system' }
	];

	const iconSize = $derived({
		sm: 16,
		md: 20,
		lg: 24
	}[size]);

	const buttonSize = $derived({
		sm: 'p-2',
		md: 'p-2.5',
		lg: 'p-3'
	}[size]);

	function setTheme(theme: Theme) {
		selectedTheme.set(theme);
	}

	function getButtonClasses(theme: Theme) {
		const isActive = $selectedTheme === theme;
		const baseClasses = `${buttonSize} rounded-lg transition-all duration-200 border`;
		
		if ($currentTheme === 'dark') {
			return cn(baseClasses, isActive 
				? 'bg-emerald-600 text-white border-emerald-600' 
				: 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
			);
		}
		
		return cn(baseClasses, isActive 
			? 'bg-emerald-600 text-white border-emerald-600' 
			: 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
		);
	}
</script>

<div class="flex items-center space-x-1">
	{#each themes as theme}
		<button
			onclick={() => setTheme(theme.value)}
			class={getButtonClasses(theme.value)}
			title={$t(theme.label)}
			aria-label={$t(theme.label)}
		>
			<!-- svelte-ignore svelte_component_deprecated -->
			<svelte:component this={theme.icon} size={iconSize} />
			{#if showLabel}
				<span class="ml-2 text-sm">{$t(theme.label)}</span>
			{/if}
		</button>
	{/each}
</div>
