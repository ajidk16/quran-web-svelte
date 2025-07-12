// Export stores from base
export {
	selectedCity,
	prayerSchedule,
	userLocation,
	searchResults,
	isLoading,
	error,
	isDataFresh,
	currentPrayer,
	currentTime,
	nextPrayerCountdown
} from './stores/base';

// Export actions
export { prayerTimesActions as prayerTimesStore } from './stores/actions';

// Export with prayer prefix for convenience
export {
	selectedCity as prayerSelectedCity,
	prayerSchedule as prayerScheduleData,
	userLocation as prayerUserLocation,
	searchResults as prayerSearchResults,
	isLoading as prayerIsLoading,
	error as prayerError,
	isDataFresh as prayerIsDataFresh,
	currentPrayer as prayerCurrentInfo,
	currentTime as prayerCurrentTime,
	nextPrayerCountdown as prayerNextCountdown
} from './stores/base';

// Export types
export type { SelectedCity, UserLocation } from './utils/location';
