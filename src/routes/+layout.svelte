<script>
	import { onMount } from 'svelte';
	let { children } = $props();
	import '../app.css';
	import Header from '$lib/components/shared/Header.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import { AdzanService } from '$lib/modules/settings';
	import { initializeBookmarks } from '$lib/modules/bookmarks/store';
	import { initializeTheme, currentTheme, themeUtils } from '$lib/utils/theme';
	import { initializeLanguage } from '$lib/utils/i18n';

	onMount(() => {
		// Initialize theme system
		initializeTheme();
		
		// Initialize language system
		initializeLanguage();
		
		// Initialize bookmarks on app start
		initializeBookmarks();
	});

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));
</script>

<div class={`min-h-screen flex flex-col ${themeClasses.bgSecondary} transition-colors duration-200`}>
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
	
	<!-- Global Adzan Service -->
	<AdzanService />
</div>
