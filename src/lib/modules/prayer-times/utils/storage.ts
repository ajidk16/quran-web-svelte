import { browser } from '$app/environment';

// Constants for localStorage keys
export const STORAGE_KEYS = {
	SELECTED_CITY: 'prayer_times_selected_city',
	PRAYER_SCHEDULE: 'prayer_times_schedule',
	LAST_UPDATED: 'prayer_times_last_updated',
	USER_LOCATION: 'prayer_times_user_location'
} as const;

// Helper functions for localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;

	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch (error) {
		console.error(`Error loading from localStorage (${key}):`, error);
		return defaultValue;
	}
}

export function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Error saving to localStorage (${key}):`, error);
	}
}
