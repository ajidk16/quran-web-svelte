import { writable, derived } from 'svelte/store';
import type { JadwalSholatHarianDto, LokasiData, LokasiPencarianDto } from '../types';
import type { SelectedCity, UserLocation } from '../utils/location';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

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
export const currentPrayer = derived(prayerSchedule, ($prayerSchedule) => {
	if (!$prayerSchedule) return null;

	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();

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

	for (let i = 0; i < prayerTimes.length; i++) {
		if (currentTime >= prayerTimes[i].minutes) {
			currentPrayer = prayerTimes[i];
		} else {
			nextPrayer = prayerTimes[i];
			break;
		}
	}

	// If no next prayer found, next prayer is tomorrow's Subuh
	if (!nextPrayer) {
		nextPrayer = { ...prayerTimes[0], isNextDay: true };
	}

	return {
		current: currentPrayer,
		next: nextPrayer,
		all: prayers
	};
});

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
