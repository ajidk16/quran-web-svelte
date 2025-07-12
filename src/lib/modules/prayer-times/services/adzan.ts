import { writable, derived, get } from 'svelte/store';
import { prayerScheduleData, prayerSelectedCity } from '../store';
import { loadFromStorage, saveToStorage } from '../utils/storage';

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
let audioContext: AudioContext | null = null;

// Initialize audio
function initializeAudio() {
	if (typeof window === 'undefined') return null;
	
	if (!adzanAudio) {
		adzanAudio = new Audio('/audio/adzan.mp3');
		adzanAudio.preload = 'metadata';
		
		// Try to enable audio context for autoplay
		if (!audioContext) {
			try {
				audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				
				// Resume audio context if suspended
				if (audioContext.state === 'suspended') {
					audioContext.resume().catch(console.warn);
				}
			} catch (error) {
				console.warn('AudioContext not supported for adzan audio');
			}
		}
	}
	return adzanAudio;
}

// Enable audio on user interaction (to overcome browser restrictions)
export function enableAudioAutoplay() {
	if (typeof window === 'undefined') return;
	
	const enableAudio = () => {
		if (audioContext && audioContext.state === 'suspended') {
			audioContext.resume();
		}
		
		// Test audio element
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
		
		// Remove listeners after first interaction
		document.removeEventListener('click', enableAudio);
		document.removeEventListener('touchstart', enableAudio);
	};
	
	document.addEventListener('click', enableAudio, { once: true });
	document.addEventListener('touchstart', enableAudio, { once: true });
}

// Initialize Web Audio Context for test sounds
function initializeAudioContext() {
	if (typeof window === 'undefined') return null;
	
	if (!audioContext) {
		audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
	}
	return audioContext;
}

// Create test tone using Web Audio API
function createTestTone(frequency: number = 440, duration: number = 1000) {
	const context = initializeAudioContext();
	if (!context) return null;

	const oscillator = context.createOscillator();
	const gainNode = context.createGain();
	
	oscillator.connect(gainNode);
	gainNode.connect(context.destination);
	
	oscillator.frequency.setValueAtTime(frequency, context.currentTime);
	oscillator.type = 'sine';
	
	// Fade in and out
	gainNode.gain.setValueAtTime(0, context.currentTime);
	gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
	gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + duration / 1000 - 0.1);
	gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration / 1000);
	
	return { oscillator, gainNode, context };
}

// Get next prayer time and check if adzan should play
export const nextAdzanInfo = derived(
	[prayerScheduleData, adzanSettings],
	([$prayerScheduleData, $adzanSettings]) => {
		if (!$prayerScheduleData || !$adzanSettings.enabled) return null;

		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();
		const today = now.toDateString();

		console.log(`🕐 Current time: ${now.toLocaleTimeString()} (${currentTime} minutes)`);

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
			const prayerMinutes = hours * 60 + minutes;
			const adzanMinutes = prayerMinutes - $adzanSettings.minutesBefore;
			
			console.log(`⏱️  ${prayer.name}: ${prayer.time} = ${prayerMinutes} minutes, adzan at ${adzanMinutes} minutes (${Math.floor(adzanMinutes/60)}:${String(adzanMinutes%60).padStart(2, '0')})`);
			
			return {
				...prayer,
				minutes: prayerMinutes,
				adzanTime: adzanMinutes
			};
		});

		console.log('📅 Prayer times with adzan schedule:', prayerTimes.map(p => ({
			name: p.name,
			time: p.time,
			adzanTime: p.adzanTime,
			minutesBefore: $adzanSettings.minutesBefore
		})));

		// Check each prayer to see if adzan should play now
		for (const prayer of prayerTimes) {
			// Allow 10-minute window after adzan time for playback
			const adzanWindowEnd = prayer.adzanTime + 10;
			const shouldPlayNow = currentTime >= prayer.adzanTime && currentTime < adzanWindowEnd;
			
			if (shouldPlayNow) {
				console.log(`🕌 Adzan time! Prayer: ${prayer.name}, adzanTime: ${prayer.adzanTime}, currentTime: ${currentTime}, window ends at: ${adzanWindowEnd}`);
				return {
					prayer: prayer.name,
					prayerTime: prayer.time,
					adzanTime: prayer.adzanTime,
					minutesUntilAdzan: 0,
					shouldPlayNow: true
				};
			}
		}

		// Find the next prayer that should have adzan
		for (const prayer of prayerTimes) {
			if (currentTime < prayer.adzanTime) {
				console.log(`⏰ Next prayer: ${prayer.name}, adzanTime: ${prayer.adzanTime}, currentTime: ${currentTime}, minutesUntil: ${prayer.adzanTime - currentTime}`);
				return {
					prayer: prayer.name,
					prayerTime: prayer.time,
					adzanTime: prayer.adzanTime,
					minutesUntilAdzan: prayer.adzanTime - currentTime,
					shouldPlayNow: false
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
	
	// Add debug logging
	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();
	console.log(`🕐 Checking adzan at ${now.toLocaleTimeString()}, current minute: ${currentTime}`);
	
	if (!info) {
		console.log('❌ No next adzan info available - missing prayer data or adzan disabled');
		return;
	}
	
	console.log(`📋 Adzan info:`, {
		prayer: info.prayer,
		adzanTime: info.adzanTime,
		shouldPlayNow: info.shouldPlayNow,
		enabled: settings.enabled,
		minutesUntilAdzan: info.minutesUntilAdzan
	});
	
	if (!info.shouldPlayNow) {
		console.log(`⏰ Not time yet. Minutes until adzan: ${info.minutesUntilAdzan}`);
		return;
	}
	
	if (!settings.enabled) {
		console.log('🔇 Adzan disabled in settings');
		return;
	}

	const today = new Date().toDateString();
	const lastPlayedKey = `${today}-${info.prayer}`;
	
	// Check if already played today for this prayer
	if (settings.lastPlayedDate === lastPlayedKey) {
		console.log(`✅ Already played today: ${lastPlayedKey}`);
		return;
	}

	console.log(`🕌 TRIGGERING ADZAN for ${info.prayer} at ${now.toLocaleTimeString()}`);
	
	// Alert for debugging
	alert(`🕌 ADZAN TIME! ${info.prayer} - ${now.toLocaleTimeString()}`);
	
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
		// First try to play the actual adzan file
		const audio = initializeAudio();
		if (!audio) {
			console.warn('Audio tidak tersedia (server-side rendering)');
			return;
		}

		const settings = get(adzanSettings);
		
		// Show notification
		showAdzanNotification(prayerName);
		
		// Check if this is a test call
		if (prayerName === 'Test') {
			console.log('🧪 Playing test adzan...');
			// Show notification for test
			showAdzanNotification(prayerName);
			await playTestTone();
			return;
		}
		
		// Try to play actual adzan file
		audio.volume = settings.volume;
		
		// Add error handler for missing file
		const handleError = () => {
			console.warn('⚠️ File adzan.mp3 tidak ditemukan, menggunakan test tone');
			playTestTone();
		};
		
		audio.addEventListener('error', handleError, { once: true });
		
		try {
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				await playPromise;
				console.log(`🕌 Adzan dimainkan untuk ${prayerName}`);
			}
		} catch (playError) {
			console.warn('Gagal memutar file audio, menggunakan test tone');
			await playTestTone();
		}
		
	} catch (error: any) {
		console.error('Error playing adzan:', error);
		
		// Fallback to test tone
		try {
			await playTestTone();
		} catch (fallbackError) {
			// Handle different types of audio errors
			if (error.name === 'NotAllowedError') {
				alert('🔇 Browser memblokir audio otomatis.\n\nSilakan klik tombol test audio setelah berinteraksi dengan halaman ini.');
			} else {
				alert(`❌ Error memutar adzan: ${error.message}`);
			}
		}
	}
}

// Play test tone when real audio file is not available
export async function playTestTone() {
	try {
		const toneData = createTestTone(800, 1500); // 800Hz for 1.5 seconds
		if (!toneData) {
			throw new Error('Web Audio API tidak tersedia');
		}
		
		const { oscillator, context } = toneData;
		
		// Resume audio context if suspended (required by modern browsers)
		if (context.state === 'suspended') {
			await context.resume();
		}
		
		oscillator.start(context.currentTime);
		oscillator.stop(context.currentTime + 1.5);
		
		console.log('🔔 Test tone berhasil diputar (file adzan.mp3 tidak tersedia)');
		
	} catch (error) {
		console.error('Error playing test tone:', error);
		throw error;
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

// Test audio functionality
export async function testAudio() {
	try {
		await playTestTone();
		console.log('✅ Test audio berhasil');
	} catch (error) {
		console.error('❌ Test audio gagal:', error);
		alert('❌ Test audio gagal. Pastikan browser mendukung Web Audio API.');
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
