<script>
	let { children } = $props();
	import '../app.css';
	import Header from '$lib/components/shared/Header.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	import { AdzanService } from '$lib/modules/settings';
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
	
	<!-- Global Adzan Service -->
	<AdzanService />
</div>
