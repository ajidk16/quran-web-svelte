import { writable, derived } from 'svelte/store';
import type { JadwalSholatHarianDto, LokasiData, LokasiPencarianDto } from '../types';
import type { SelectedCity, UserLocation } from '../utils/location';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { browser } from '$app/environment';

// Real-time clock store
export const currentTime = writable(new Date());

// Update the clock every second (only in browser)
if (browser) {
	setInterval(() => {
		currentTime.set(new Date());
	}, 1000);
}

// Create base stores
export const selectedCity = writable<SelectedCity | null>(
	loadFromStorage(STORAGE_KEYS.SELECTED_CITY, null)
);

export const prayerSchedule = writable<JadwalSholatHarianDto | null>(
	loadFromStorage(STORAGE_KEYS.PRAYER_SCHEDULE, null)
);

export const userLocation = writable<UserLocation | null>(
	loadFromStorage(STORAGE_KEYS.USER_LOCATION, null)
);

export const searchResults = writable<LokasiData[]>([]);

export const isLoading = writable(false);

export const error = writable<string | null>(null);

// Derived store to check if data is fresh (less than 1 hour old)
export const isDataFresh = derived(prayerSchedule, ($prayerSchedule) => {
	if (!$prayerSchedule) return false;

	const lastUpdated = loadFromStorage(STORAGE_KEYS.LAST_UPDATED, 0);
	const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
	const now = Date.now();

	return now - lastUpdated < oneHour;
});

// Derived store for current prayer info
export const currentPrayer = derived(
	[prayerSchedule, currentTime],
	([$prayerSchedule, $currentTime]) => {
		if (!$prayerSchedule) return null;

		const now = $currentTime;
		const currentMinutes = now.getHours() * 60 + now.getMinutes();

		const jadwal = $prayerSchedule.data.jadwal;
		const prayers = [
			{ name: 'Subuh', time: jadwal.subuh },
			{ name: 'Dzuhur', time: jadwal.dzuhur },
			{ name: 'Ashar', time: jadwal.ashar },
			{ name: 'Maghrib', time: jadwal.maghrib },
			{ name: 'Isya', time: jadwal.isya }
		];

		// Convert prayer times to minutes
		const prayerTimes = prayers.map((prayer) => {
			const [hours, minutes] = prayer.time.split(':').map(Number);
			return {
				...prayer,
				minutes: hours * 60 + minutes
			};
		});

		// Find current and next prayer
		let currentPrayer = null;
		let nextPrayer = null;

		// Constants
		const ONE_HOUR_IN_MINUTES = 60;

		for (let i = 0; i < prayerTimes.length; i++) {
			const prayerTime = prayerTimes[i].minutes;
			const timeSincePrayer = currentMinutes - prayerTime;

			// If current time is past this prayer time
			if (currentMinutes >= prayerTime) {
				// Only consider it "current" if less than 1 hour has passed
				if (timeSincePrayer < ONE_HOUR_IN_MINUTES) {
					currentPrayer = prayerTimes[i];
				}
			} else {
				// This is the next prayer time
				nextPrayer = prayerTimes[i];
				break;
			}
		}

		// If no next prayer found, next prayer is tomorrow's Subuh
		if (!nextPrayer) {
			nextPrayer = { ...prayerTimes[0], isNextDay: true };
		}

		// If no current prayer (more than 1 hour has passed since the last prayer),
		// we should show the next prayer as the upcoming one
		if (!currentPrayer && nextPrayer) {
			// Check if the last prayer of the day has passed by more than 1 hour
			const lastPrayer = prayerTimes[prayerTimes.length - 1];
			const timeSinceLastPrayer = currentMinutes - lastPrayer.minutes;
			
			// If it's past the last prayer by more than 1 hour, 
			// we're in the period before tomorrow's first prayer
			if (timeSinceLastPrayer >= ONE_HOUR_IN_MINUTES) {
				// Keep nextPrayer as is (tomorrow's Subuh)
			}
		}

		return {
			current: currentPrayer,
			next: nextPrayer,
			all: prayers
		};
	}
);

// Derived store for real-time countdown to next prayer
export const nextPrayerCountdown = derived(
	[prayerSchedule, currentTime], 
	([$prayerSchedule, $currentTime]) => {
		if (!$prayerSchedule) return null;

		const now = $currentTime;
		const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

		const jadwal = $prayerSchedule.data.jadwal;
		const prayers = [
			{ name: 'Subuh', time: jadwal.subuh },
			{ name: 'Dzuhur', time: jadwal.dzuhur },
			{ name: 'Ashar', time: jadwal.ashar },
			{ name: 'Maghrib', time: jadwal.maghrib },
			{ name: 'Isya', time: jadwal.isya }
		];

		// Convert prayer times to minutes
		const prayerTimes = prayers.map((prayer) => {
			const [hours, minutes] = prayer.time.split(':').map(Number);
			return {
				...prayer,
				minutes: hours * 60 + minutes
			};
		});

		// Find next prayer
		let nextPrayer = null;
		let remainingMinutes = 0;

		for (let i = 0; i < prayerTimes.length; i++) {
			if (currentMinutes < prayerTimes[i].minutes) {
				nextPrayer = prayerTimes[i];
				remainingMinutes = prayerTimes[i].minutes - currentMinutes;
				break;
			}
		}

		// If no next prayer found, next prayer is tomorrow's Subuh
		if (!nextPrayer) {
			nextPrayer = { ...prayerTimes[0], isNextDay: true };
			// Calculate time until tomorrow's Subuh (24 hours - current time + Subuh time)
			const minutesUntilMidnight = (24 * 60) - currentMinutes;
			remainingMinutes = minutesUntilMidnight + prayerTimes[0].minutes;
		}

		// Convert remaining minutes to hours, minutes, seconds
		const totalSeconds = Math.floor(remainingMinutes * 60);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return {
			nextPrayer,
			remaining: {
				totalMinutes: remainingMinutes,
				totalSeconds,
				hours,
				minutes,
				seconds
			}
		};
	}
);

// Subscribe to stores to save changes to localStorage
selectedCity.subscribe((value) => {
	saveToStorage(STORAGE_KEYS.SELECTED_CITY, value);
});

prayerSchedule.subscribe((value) => {
	saveToStorage(STORAGE_KEYS.PRAYER_SCHEDULE, value);
	if (value) {
		saveToStorage(STORAGE_KEYS.LAST_UPDATED, Date.now());
	}
});

userLocation.subscribe((value) => {
	saveToStorage(STORAGE_KEYS.USER_LOCATION, value);
});
