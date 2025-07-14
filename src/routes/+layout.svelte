<script>
	import { onMount } from 'svelte';
	let { children } = $props();
	import '../app.css';
	import Header from '$lib/components/shared/Header.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import { AdzanService } from '$lib/modules/settings';
	import { currentTheme } from '$lib/utils/theme';
	import { initializeBookmarks } from '$lib/modules/bookmarks/store';

	// Initialize bookmarks on mount
	onMount(() => {
		initializeBookmarks();
	});
</script>

<div
	class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
	data-theme={$currentTheme}
>
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />

	<!-- Global Adzan Service -->
	<AdzanService />
</div>
