import { fetchJadwalHarian, fetchLokasiPencarian } from '../api';
import type { SelectedCity } from '../utils/location';
import { getUserLocation, getCityFromCoordinates } from '../utils/location';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import {
	selectedCity,
	prayerSchedule,
	userLocation,
	searchResults,
	isLoading,
	error
} from './base';

// Store actions
export const prayerTimesActions = {
	// Set selected city and fetch prayer times

	async setCity(city: SelectedCity) {
		selectedCity.set(city);
		await this.fetchPrayerTimes(city.id);
	},

	// Fetch prayer times for a city
	async fetchPrayerTimes(cityId: string) {
		isLoading.set(true);
		error.set(null);

		try {
			const targetDate = new Date().toLocaleDateString('en-CA');
			const schedule = await fetchJadwalHarian(cityId, targetDate);

			prayerSchedule.set(schedule);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil jadwal sholat';
			error.set(errorMessage);
			console.error('Error fetching prayer times:', err);
		} finally {
			isLoading.set(false);
		}
	},

	// Search for cities
	async searchCities(keyword: string) {
		if (!keyword.trim()) {
			searchResults.set([]);
			return;
		}

		isLoading.set(true);
		error.set(null);

		try {
			const results = await fetchLokasiPencarian(keyword);

			return searchResults.set(results?.data || []);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Gagal mencari kota';
			error.set(errorMessage);
			console.error('Error searching cities:', err);
		} finally {
			isLoading.set(false);
		}
	},

	// Find matching city in prayer times API based on GPS location
	async findNearestPrayerCity(latitude: number, longitude: number): Promise<SelectedCity | null> {
		try {
			const cityName = await getCityFromCoordinates(latitude, longitude);

			if (!cityName) {
				return null;
			}

			const results = await fetchLokasiPencarian(cityName?.city || '');

			return results?.data?.length > 0
				? {
						id: results.data[0].id,
						lokasi: results.data[0].lokasi
					}
				: null;
		} catch (err) {
			console.error('Error finding nearest prayer city:', err);
			return null;
		}
	},

	// Get location and automatically set prayer times
	async getUserLocationAndSetPrayer(): Promise<{
		location: any;
		city: SelectedCity | null;
	}> {
		try {
			const location = await getUserLocation();

			if (!location) {
				return { location: null, city: null };
			}

			userLocation.set(location);

			const nearestCity = await this.findNearestPrayerCity(location.latitude, location.longitude);

			if (nearestCity) {
				await this.setCity(nearestCity);
				return { location, city: nearestCity };
			}

			return { location, city: null };
		} catch (err) {
			console.error('Error in getUserLocationAndSetPrayer:', err);
			error.set(err instanceof Error ? err.message : 'Gagal mendapatkan lokasi');
			return { location: null, city: null };
		}
	},

	// Refresh prayer times if data is stale
	async refreshIfNeeded() {
		const $selectedCity = loadFromStorage<SelectedCity | null>(STORAGE_KEYS.SELECTED_CITY, null);
		const $lastUpdated = loadFromStorage(STORAGE_KEYS.LAST_UPDATED, 0);
		const oneHour = 60 * 60 * 1000;
		const now = Date.now();

		if ($selectedCity && now - $lastUpdated >= oneHour) {
			await this.fetchPrayerTimes($selectedCity.id);
		}
	},

	// Initialize store
	async initialize() {
		await this.refreshIfNeeded();
	},

	// Clear all data
	clearData() {
		selectedCity.set(null);
		prayerSchedule.set(null);
		userLocation.set(null);
		searchResults.set([]);
		error.set(null);
	}
};
