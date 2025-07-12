import { writable, derived, get } from 'svelte/store';
import { prayerScheduleData, prayerSelectedCity } from '$lib/modules/prayer-times/store';
import { loadFromStorage, saveToStorage } from '$lib/modules/prayer-times/utils/storage';

// Adzan settings store
interface AdzanSettings {
	enabled: boolean;
	volume: number; // 0-1
	minutesBefore: number; // default 5 minutes
	lastPlayedDate: string; // to prevent duplicate plays on same day
	mutedPrayers: string[]; // prayers that user doesn't want adzan for
}

const defaultSettings: AdzanSettings = {
	enabled: true,
	volume: 0.7,
	minutesBefore: 5,
	lastPlayedDate: '',
	mutedPrayers: []
};

// Create adzan settings store
export const adzanSettings = writable<AdzanSettings>(
	loadFromStorage('adzan_settings', defaultSettings)
);

// Save settings to localStorage when changed
adzanSettings.subscribe((settings) => {
	saveToStorage('adzan_settings', settings);
});

// Audio instance
let adzanAudio: HTMLAudioElement | null = null;

// Initialize audio
function initializeAudio() {
	if (typeof window === 'undefined') return null;
	
	if (!adzanAudio) {
		adzanAudio = new Audio('/audio/adzan.mp3');
		adzanAudio.preload = 'metadata';
	}
	return adzanAudio;
}

// Get next prayer time and check if adzan should play
export const nextAdzanInfo = derived(
	[prayerScheduleData, adzanSettings],
	([$prayerScheduleData, $adzanSettings]) => {
		if (!$prayerScheduleData || !$adzanSettings.enabled) return null;

		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();
		const today = now.toDateString();

		const jadwal = $prayerScheduleData.data.jadwal;
		const prayers = [
			{ name: 'Subuh', time: jadwal.subuh },
			{ name: 'Dzuhur', time: jadwal.dzuhur },
			{ name: 'Ashar', time: jadwal.ashar },
			{ name: 'Maghrib', time: jadwal.maghrib },
			{ name: 'Isya', time: jadwal.isya }
		].filter(prayer => !$adzanSettings.mutedPrayers.includes(prayer.name));

		// Convert prayer times to minutes and find next prayer
		const prayerTimes = prayers.map((prayer) => {
			const [hours, minutes] = prayer.time.split(':').map(Number);
			return {
				...prayer,
				minutes: hours * 60 + minutes,
				adzanTime: hours * 60 + minutes - $adzanSettings.minutesBefore
			};
		});

		// Find the next prayer that should have adzan
		for (const prayer of prayerTimes) {
			if (currentTime < prayer.adzanTime) {
				return {
					prayer: prayer.name,
					prayerTime: prayer.time,
					adzanTime: prayer.adzanTime,
					minutesUntilAdzan: prayer.adzanTime - currentTime,
					shouldPlayNow: currentTime >= prayer.adzanTime && currentTime < prayer.minutes
				};
			}
		}

		// If no prayer found for today, check tomorrow's Subuh
		const subuhPrayer = prayerTimes.find(p => p.name === 'Subuh');
		if (subuhPrayer) {
			const tomorrowAdzanTime = subuhPrayer.adzanTime + (24 * 60); // Add 24 hours
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

// Check and play adzan if needed
export function checkAndPlayAdzan() {
	const info = get(nextAdzanInfo);
	const settings = get(adzanSettings);
	
	if (!info || !info.shouldPlayNow || !settings.enabled) return;

	const today = new Date().toDateString();
	const lastPlayedKey = `${today}-${info.prayer}`;
	
	// Check if already played today for this prayer
	if (settings.lastPlayedDate === lastPlayedKey) return;

	playAdzan(info.prayer);
	
	// Update last played date
	adzanSettings.update(s => ({
		...s,
		lastPlayedDate: lastPlayedKey
	}));
}

// Play adzan sound
export async function playAdzan(prayerName: string) {
	try {
		const audio = initializeAudio();
		if (!audio) return;

		const settings = get(adzanSettings);
		audio.volume = settings.volume;
		
		// Show notification
		showAdzanNotification(prayerName);
		
		// Play audio
		await audio.play();
		
		console.log(`🕌 Adzan dimainkan untuk ${prayerName}`);
	} catch (error) {
		console.error('Error playing adzan:', error);
	}
}

// Show browser notification
function showAdzanNotification(prayerName: string) {
	if (typeof window === 'undefined') return;

	// Request notification permission if not granted
	if (Notification.permission === 'default') {
		Notification.requestPermission();
	}

	if (Notification.permission === 'granted') {
		new Notification(`🕌 Waktu ${prayerName}`, {
			body: `Adzan ${prayerName} akan segera berkumandang`,
			icon: '/favicon.svg',
			tag: `adzan-${prayerName}`,
			requireInteraction: false
		});
	}
}

// Stop adzan
export function stopAdzan() {
	if (adzanAudio) {
		adzanAudio.pause();
		adzanAudio.currentTime = 0;
	}
}

// Update adzan settings
export function updateAdzanSettings(updates: Partial<AdzanSettings>) {
	adzanSettings.update(settings => ({
		...settings,
		...updates
	}));
}

// Toggle prayer from muted list
export function togglePrayerMute(prayerName: string) {
	adzanSettings.update(settings => {
		const mutedPrayers = settings.mutedPrayers.includes(prayerName)
			? settings.mutedPrayers.filter(p => p !== prayerName)
			: [...settings.mutedPrayers, prayerName];
		
		return {
			...settings,
			mutedPrayers
		};
	});
}

// Format time until next adzan
export function formatTimeUntilAdzan(minutes: number): string {
	if (minutes < 60) {
		return `${minutes} menit`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return `${hours} jam ${remainingMinutes} menit`;
}
