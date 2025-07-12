<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { checkAndPlayAdzan, nextAdzanInfo, adzanSettings } from '../services/adzan';
	import { prayerSelectedCity } from '../store';

	let interval: NodeJS.Timeout | null = null;

	onMount(() => {
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

		// Check every minute
		interval = setInterval(() => {
			checkAndPlayAdzan();
		}, 60000); // 60 seconds

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
