<script>
	let { children } = $props();
	import '../app.css';
	import Header from '$lib/components/shared/Header.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import ThemeDebug from '$lib/components/shared/ThemeDebug.svelte';
	import { AdzanService } from '$lib/modules/settings';
	import { initializeTheme } from '$lib/utils/theme';
	import { onMount } from 'svelte';

	onMount(() => {
		// Initialize theme system
		const cleanup = initializeTheme();
		return cleanup;
	});
</script>

<div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
	
	<!-- Global Adzan Service -->
	<AdzanService />
	
	<!-- Theme Debug (dev only) -->
	<ThemeDebug />
</div>
