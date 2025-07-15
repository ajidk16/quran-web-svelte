import { derived, get } from 'svelte/store';
import { adzanSettings, initializeAudio, showNotification, playTestTone } from './services';
import { prayerScheduleData } from '../prayer-times/store';

// Adzan timing information
export const adzanInfo = derived(
	[prayerScheduleData, adzanSettings],
	([$prayerData, $adzanSettings]) => {
		if (!$prayerData || !$adzanSettings.enabled) return null;

		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();

		const jadwal = $prayerData.data.jadwal;
		const prayers = [
			{ name: 'Subuh', time: jadwal.subuh },
			{ name: 'Dzuhur', time: jadwal.dzuhur },
			{ name: 'Ashar', time: jadwal.ashar },
			{ name: 'Maghrib', time: jadwal.maghrib },
			{ name: 'Isya', time: jadwal.isya }
		].filter((prayer) => !$adzanSettings.mutedPrayers.includes(prayer.name));

		const prayerTimes = prayers.map((prayer) => {
			const [hours, minutes] = prayer.time.split(':').map(Number);
			const prayerMinutes = hours * 60 + minutes;
			const adzanMinutes = prayerMinutes - $adzanSettings.minutesBefore;

			return {
				...prayer,
				minutes: prayerMinutes,
				adzanTime: adzanMinutes
			};
		});

		// Check if adzan should play now
		for (const prayer of prayerTimes) {
			const adzanWindowEnd = prayer.adzanTime + 10; // 10-minute window
			const shouldPlayNow = currentTime >= prayer.adzanTime && currentTime < adzanWindowEnd;

			if (shouldPlayNow) {
				console.log(`🕌 ADZAN WINDOW ACTIVE! ${prayer.name} at ${currentTime}`);
				return {
					prayer: prayer.name,
					prayerTime: prayer.time,
					adzanTime: prayer.adzanTime,
					minutesUntilAdzan: 0,
					shouldPlayNow: true
				};
			}
		}

		// Find next prayer
		for (const prayer of prayerTimes) {
			if (currentTime < prayer.adzanTime) {
				return {
					prayer: prayer.name,
					prayerTime: prayer.time,
					adzanTime: prayer.adzanTime,
					minutesUntilAdzan: prayer.adzanTime - currentTime,
					shouldPlayNow: false
				};
			}
		}

		// Tomorrow's Subuh
		const subuhPrayer = prayerTimes.find((p) => p.name === 'Subuh');
		if (subuhPrayer) {
			const tomorrowAdzanTime = subuhPrayer.adzanTime + 24 * 60;
			return {
				prayer: 'Subuh',
				prayerTime: subuhPrayer.time,
				adzanTime: tomorrowAdzanTime,
				minutesUntilAdzan: tomorrowAdzanTime - currentTime,
				shouldPlayNow: false,
				isNextDay: true
			};
		}

		return null;
	}
);

// Play adzan audio
export async function playAdzan(prayerName: string) {
	try {
		const audio = initializeAudio();
		if (!audio) {
			console.warn('Audio not available');
			return;
		}

		const settings = get(adzanSettings);

		// Show notification
		showNotification(`🕌 Waktu ${prayerName}`, `Adzan ${prayerName} akan segera berkumandang`);

		// Handle test calls
		if (prayerName === 'Test') {
			console.log('🧪 Playing test adzan...');
			await playTestTone();
			return;
		}

		// Set volume and play
		audio.volume = settings.volume;

		// Error handler for missing audio file
		const handleError = () => {
			console.warn('⚠️ Audio file not found, using test tone');
			playTestTone();
		};

		audio.addEventListener('error', handleError, { once: true });

		try {
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				await playPromise;
				console.log(`🕌 Adzan played for ${prayerName}`);
			}
		} catch (playError) {
			console.warn('Failed to play audio file, using test tone');
			await playTestTone();
		}
	} catch (error: unknown) {
		console.error('Error playing adzan:', error);

		try {
			await playTestTone();
		} catch (fallbackError) {
			if (error instanceof Error && error.name === 'NotAllowedError') {
				alert(
					'🔇 Browser blocked auto audio.\n\nPlease click test audio button after interacting with this page.'
				);
			} else {
				alert(
					`❌ Error playing adzan: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			}
		}
	}
}

// Check and trigger adzan
export function checkAndPlayAdzan() {
	const info = get(adzanInfo);
	const settings = get(adzanSettings);

	if (!info || !info.shouldPlayNow || !settings.enabled) return;

	const today = new Date().toDateString();
	const lastPlayedKey = `${today}-${info.prayer}`;

	// Check if already played today
	if (settings.lastPlayedDate === lastPlayedKey) return;

	console.log(`🕌 TRIGGERING ADZAN for ${info.prayer}`);

	playAdzan(info.prayer);

	// Update last played date
	import('./services').then(({ updateAdzanSettings }) => {
		updateAdzanSettings({ lastPlayedDate: lastPlayedKey });
	});
}

// Stop adzan
export function stopAdzan() {
	const audio = initializeAudio();
	if (audio) {
		audio.pause();
		audio.currentTime = 0;
	}
}

// Test audio functionality
export async function testAudio() {
	try {
		await playTestTone();
		console.log('✅ Test audio successful');
	} catch (error) {
		console.error('❌ Test audio failed:', error);
		alert('❌ Test audio failed. Make sure browser supports Web Audio API.');
	}
}
