<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { checkAndPlayAdzan, nextAdzanInfo, adzanSettings, enableAudioAutoplay } from '../services/adzan';
	import { prayerSelectedCity } from '../store';

	let interval: NodeJS.Timeout | null = null;

	onMount(() => {
		// Enable audio autoplay on user interaction
		enableAudioAutoplay();
		
		// Only start if user has selected a city
		if ($prayerSelectedCity) {
			startAdzanService();
		}

		// Start service when city is selected
		const unsubscribe = prayerSelectedCity.subscribe((city) => {
			if (city) {
				startAdzanService();
			} else {
				stopAdzanService();
			}
		});

		return unsubscribe;
	});

	onDestroy(() => {
		stopAdzanService();
	});

	function startAdzanService() {
		// Clear existing interval
		if (interval) clearInterval(interval);

		// Check immediately
		checkAndPlayAdzan();

		// Check every 30 seconds to avoid missing the window
		interval = setInterval(() => {
			checkAndPlayAdzan();
		}, 30000); // 30 seconds

		console.log('🕌 Adzan service started');
	}

	function stopAdzanService() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}
</script>

<!-- This component has no visible UI, it just runs the adzan service in the background -->
