// Settings module types
export interface AdzanSettings {
	enabled: boolean;
	volume: number; // 0-1
	minutesBefore: number; // minutes before prayer time
	lastPlayedDate: string; // to prevent duplicate plays
	mutedPrayers: string[]; // prayers that user doesn't want adzan for
	audioFile: string; // path to audio file
	notificationEnabled: boolean; // browser notifications
}

export interface AppSettings {
	theme: 'light' | 'dark' | 'auto';
	language: 'id' | 'ar' | 'en';
	timezone: string;
	autoLocation: boolean;
	defaultCity: string;
}

export interface UserPreferences {
	adzan: AdzanSettings;
	app: AppSettings;
	quran: QuranSettings;
	lastUpdated: string;
}

export interface SettingsCategory {
	id: string;
	title: string;
	description: string;
	icon: string;
}

export interface SettingItem {
	id: string;
	type: 'toggle' | 'slider' | 'select' | 'text' | 'number' | 'time';
	label: string;
	description?: string;
	value: any;
	options?: { label: string; value: any }[];
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
}

export type SettingsUpdateEvent = {
	category: keyof UserPreferences;
	key: string;
	value: any;
	timestamp: string;
};

export interface QuranSettings {
	autoplayRecitation: boolean;
	reciterId: string; // selected reciter
	translationLanguage: 'id' | 'en' | 'ar';
	showArabicText: boolean;
	showTranslation: boolean;
	showTransliteration: boolean;
	arabicTextSize: number; // 1-5 scale
	translationTextSize: number; // 1-5 scale
	playbackSpeed: number; // 0.5-2.0
	repeatMode: 'none' | 'verse' | 'surah';
	defaultTranslation: string; // translation ID
	favoriteReciters: string[];
	lastReadSurah: number;
	lastReadVerse: number;
	readingProgress: { [surahId: number]: number }; // verse numbers
	bookmarks: { surah: number; verse: number; note?: string; timestamp: string }[];
	nightMode: boolean;
	highlightCurrentVerse: boolean;
	autoScroll: boolean;
}