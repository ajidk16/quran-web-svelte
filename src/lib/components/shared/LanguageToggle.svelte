<script lang="ts">
	import { Globe } from '@lucide/svelte';
	import { currentLanguage, languageUtils, type Language } from '$lib/utils/i18n';
	import { currentTheme } from '$lib/utils/theme';
	import { cn } from '$lib/utils';

	const {
		size = 'md',
		showDropdown = true
	}: {
		size?: 'sm' | 'md' | 'lg';
		showDropdown?: boolean;
	} = $props();

	let isOpen = $state(false);
	const languages = languageUtils.getAvailableLanguages();

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

	function toggleLanguage() {
		if (!showDropdown) {
			currentLanguage.toggle();
			return;
		}
		isOpen = !isOpen;
	}

	function selectLanguage(language: Language) {
		currentLanguage.set(language);
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (!target.closest('.language-toggle')) {
			isOpen = false;
		}
	}

	const currentLangInfo = $derived(languageUtils.getCurrentLanguageInfo($currentLanguage));

	const buttonClasses = $derived(cn(
		buttonSize,
		'rounded-lg transition-all duration-200 border flex items-center space-x-2',
		$currentTheme === 'dark'
			? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
			: 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
	));

	const dropdownClasses = $derived(cn(
		'absolute top-full right-0 mt-2 py-2 min-w-48 rounded-lg shadow-lg border z-50',
		$currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
	));
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative language-toggle">
	<button
		on:click={toggleLanguage}
		class={buttonClasses}
		title="Change Language"
		aria-label="Change Language"
	>
		{#if showDropdown}
			<span class="text-sm font-medium">{currentLangInfo.flag}</span>
			<span class="text-xs">▼</span>
		{/if}
	</button>

	{#if showDropdown && isOpen}
		<div class={dropdownClasses}>
			{#each languages as language}
				<button
					on:click={() => selectLanguage(language.code as Language)}
					class={cn(
						'w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors',
						$currentLanguage === language.code
							? $currentTheme === 'dark'
								? 'bg-emerald-600 text-white'
								: 'bg-emerald-50 text-emerald-700'
							: $currentTheme === 'dark'
								? 'hover:bg-gray-700 text-gray-300'
								: 'hover:bg-gray-50 text-gray-700'
					)}
				>
					<span class="text-lg">{language.flag}</span>
					<span class="text-sm font-medium">{language.name}</span>
					{#if $currentLanguage === language.code}
						<span class="ml-auto text-emerald-500">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
