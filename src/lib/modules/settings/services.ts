import { writable, derived, get } from 'svelte/store';
import type { UserPreferences, AdzanSettings, AppSettings, QuranSettings, SettingsUpdateEvent } from './types';

// Default settings
const defaultAdzanSettings: AdzanSettings = {
	enabled: true,
	volume: 0.7,
	minutesBefore: 5,
	lastPlayedDate: '',
	mutedPrayers: [],
	audioFile: '/audio/adzan.mp3',
	notificationEnabled: true
};

const defaultAppSettings: AppSettings = {
	theme: 'auto',
	language: 'id',
	timezone: 'Asia/Jakarta',
	autoLocation: true,
	defaultCity: ''
};

const defaultQuranSettings: QuranSettings = {
	autoplayRecitation: false,
	reciterId: 'abdul-rahman-al-sudais',
	translationLanguage: 'id',
	showArabicText: true,
	showTranslation: true,
	showTransliteration: false,
	arabicTextSize: 3,
	translationTextSize: 3,
	playbackSpeed: 1.0,
	repeatMode: 'none',
	defaultTranslation: 'id-indonesian',
	favoriteReciters: ['abdul-rahman-al-sudais', 'mishary-rashid-alafasy'],
	lastReadSurah: 1,
	lastReadVerse: 1,
	readingProgress: {},
	bookmarks: [],
	nightMode: false,
	highlightCurrentVerse: true,
	autoScroll: true
};

const defaultUserPreferences: UserPreferences = {
	adzan: defaultAdzanSettings,
	app: defaultAppSettings,
	quran: defaultQuranSettings,
	lastUpdated: new Date().toISOString()
};

// Storage utilities
function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (typeof window === 'undefined') return defaultValue;
	
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch (error) {
		console.warn(`Failed to load ${key} from localStorage:`, error);
		return defaultValue;
	}
}

function saveToStorage<T>(key: string, value: T): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(`Failed to save ${key} to localStorage:`, error);
	}
}

// Settings stores
export const userPreferences = writable<UserPreferences>(
	loadFromStorage('user_preferences', defaultUserPreferences)
);

// Auto-save to localStorage
userPreferences.subscribe((preferences) => {
	saveToStorage('user_preferences', preferences);
});

// Derived stores for specific settings
export const adzanSettings = derived(
	userPreferences,
	($preferences) => $preferences.adzan
);

export const appSettings = derived(
	userPreferences,
	($preferences) => $preferences.app
);

export const quranSettings = derived(
	userPreferences,
	($preferences) => $preferences.quran
);

// Settings update functions
export function updateAdzanSettings(updates: Partial<AdzanSettings>) {
	userPreferences.update(prefs => ({
		...prefs,
		adzan: { ...prefs.adzan, ...updates },
		lastUpdated: new Date().toISOString()
	}));
}

export function updateAppSettings(updates: Partial<AppSettings>) {
	userPreferences.update(prefs => ({
		...prefs,
		app: { ...prefs.app, ...updates },
		lastUpdated: new Date().toISOString()
	}));
}

export function updateQuranSettings(updates: Partial<QuranSettings>) {
	userPreferences.update(prefs => ({
		...prefs,
		quran: { ...prefs.quran, ...updates },
		lastUpdated: new Date().toISOString()
	}));
}

export function resetSettings() {
	userPreferences.set({
		...defaultUserPreferences,
		lastUpdated: new Date().toISOString()
	});
}

export function resetAdzanSettings() {
	updateAdzanSettings(defaultAdzanSettings);
}

export function resetAppSettings() {
	updateAppSettings(defaultAppSettings);
}

export function resetQuranSettings() {
	updateQuranSettings(defaultQuranSettings);
}

// Audio management
let audioElement: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;

export function initializeAudio(): HTMLAudioElement | null {
	if (typeof window === 'undefined') return null;
	
	const settings = get(adzanSettings);
	
	if (!audioElement) {
		audioElement = new Audio(settings.audioFile);
		audioElement.preload = 'metadata';
		audioElement.volume = settings.volume;
		
		// Initialize audio context for better browser compatibility
		if (!audioContext) {
			try {
				audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				
				if (audioContext.state === 'suspended') {
					audioContext.resume().catch(console.warn);
				}
			} catch (error) {
				console.warn('AudioContext not supported');
			}
		}
	}
	
	return audioElement;
}

export function enableAudioAutoplay() {
	if (typeof window === 'undefined') return;
	
	const enableAudio = () => {
		if (audioContext && audioContext.state === 'suspended') {
			audioContext.resume();
		}
		
		const audio = initializeAudio();
		if (audio) {
			audio.play().then(() => {
				audio.pause();
				audio.currentTime = 0;
				console.log('✅ Audio autoplay enabled');
			}).catch(() => {
				console.warn('⚠️ Audio autoplay still blocked');
			});
		}
		
		document.removeEventListener('click', enableAudio);
		document.removeEventListener('touchstart', enableAudio);
	};
	
	document.addEventListener('click', enableAudio, { once: true });
	document.addEventListener('touchstart', enableAudio, { once: true });
}

// Test tone generation
export function createTestTone(frequency: number = 440, duration: number = 1000) {
	if (typeof window === 'undefined') return null;
	
	try {
		if (!audioContext) {
			audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		}

		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();
		
		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);
		
		oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
		oscillator.type = 'sine';
		
		// Fade in and out
		gainNode.gain.setValueAtTime(0, audioContext.currentTime);
		gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
		gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration / 1000 - 0.1);
		gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
		
		return { oscillator, gainNode, context: audioContext };
	} catch (error) {
		console.error('Failed to create test tone:', error);
		return null;
	}
}

export async function playTestTone() {
	const toneData = createTestTone(800, 1500);
	if (!toneData) throw new Error('Web Audio API tidak tersedia');
	
	const { oscillator, context } = toneData;
	
	if (context.state === 'suspended') {
		await context.resume();
	}
	
	oscillator.start(context.currentTime);
	oscillator.stop(context.currentTime + 1.5);
	
	console.log('🔔 Test tone played');
}

// Notification management
export function showNotification(title: string, body: string, options?: NotificationOptions) {
	if (typeof window === 'undefined') return;
	
	const settings = get(adzanSettings);
	if (!settings.notificationEnabled) return;

	if (Notification.permission === 'default') {
		Notification.requestPermission();
	}

	if (Notification.permission === 'granted') {
		new Notification(title, {
			body,
			icon: '/favicon.svg',
			requireInteraction: false,
			...options
		});
	}
}

// Prayer mute management
export function togglePrayerMute(prayerName: string) {
	const currentSettings = get(adzanSettings);
	const mutedPrayers = currentSettings.mutedPrayers.includes(prayerName)
		? currentSettings.mutedPrayers.filter(p => p !== prayerName)
		: [...currentSettings.mutedPrayers, prayerName];
	
	updateAdzanSettings({ mutedPrayers });
}

export function isPrayerMuted(prayerName: string): boolean {
	const settings = get(adzanSettings);
	return settings.mutedPrayers.includes(prayerName);
}

// Volume management
export function setVolume(volume: number) {
	const clampedVolume = Math.max(0, Math.min(1, volume));
	updateAdzanSettings({ volume: clampedVolume });
	
	if (audioElement) {
		audioElement.volume = clampedVolume;
	}
}

export function getVolume(): number {
	return get(adzanSettings).volume;
}

// Settings validation
export function validateSettings(settings: Partial<UserPreferences>): boolean {
	try {
		if (settings.adzan) {
			const { volume, minutesBefore } = settings.adzan;
			if (volume !== undefined && (volume < 0 || volume > 1)) return false;
			if (minutesBefore !== undefined && (minutesBefore < 0 || minutesBefore > 60)) return false;
		}
		
		if (settings.app) {
			const { theme, language } = settings.app;
			if (theme && !['light', 'dark', 'auto'].includes(theme)) return false;
			if (language && !['id', 'ar', 'en'].includes(language)) return false;
		}
		
		return true;
	} catch {
		return false;
	}
}

// Import/Export settings
export function exportSettings(): string {
	const settings = get(userPreferences);
	return JSON.stringify(settings, null, 2);
}

export function importSettings(settingsJson: string): boolean {
	try {
		const settings = JSON.parse(settingsJson);
		
		if (!validateSettings(settings)) {
			throw new Error('Invalid settings format');
		}
		
		userPreferences.set({
			...defaultUserPreferences,
			...settings,
			lastUpdated: new Date().toISOString()
		});
		
		return true;
	} catch (error) {
		console.error('Failed to import settings:', error);
		return false;
	}
}