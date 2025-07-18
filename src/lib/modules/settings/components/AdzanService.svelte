<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { checkAndPlayAdzan, adzanInfo } from '../adzan';
	import { adzanSettings, enableAudioAutoplay } from '../services';
	import { prayerSelectedCity } from '../../prayer-times/store';

	let timeoutId: NodeJS.Timeout | null = null;
	let isRunning = false;

	onMount(() => {
		// Enable audio autoplay on user interaction
		enableAudioAutoplay();

		// Start service if city is selected
		if ($prayerSelectedCity) {
			startAdzanService();
		}

		// Watch for city selection
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
		if (isRunning) return;

		isRunning = true;

		// Check immediately
		checkAndPlayAdzan();

		// Schedule recursive checks
		scheduleNextCheck();
	}

	function scheduleNextCheck() {
		if (!isRunning) return;

		timeoutId = setTimeout(() => {
			const info = $adzanInfo;
			const shouldCheck = !document.hidden || (info && info.minutesUntilAdzan <= 2);

			if (shouldCheck) {
				checkAndPlayAdzan();
			}

			// Schedule next check
			scheduleNextCheck();
		}, 10000); // 10 seconds
	}

	function stopAdzanService() {
		isRunning = false;

		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}
</script>

<!-- Silent service component -->
