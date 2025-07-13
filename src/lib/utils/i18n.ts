import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'id' | 'en';

// Language store
const createLanguageStore = () => {
	const defaultLanguage: Language = 'id';
	
	// Load language from localStorage
	const getStoredLanguage = (): Language => {
		if (!browser) return defaultLanguage;
		try {
			const stored = localStorage.getItem('app-language') as Language;
			return stored && ['id', 'en'].includes(stored) ? stored : defaultLanguage;
		} catch {
			return defaultLanguage;
		}
	};

	const { subscribe, set } = writable<Language>(getStoredLanguage());

	return {
		subscribe,
		set: (language: Language) => {
			if (browser) {
				localStorage.setItem('app-language', language);
			}
			set(language);
		},
		toggle: () => {
			const current = getStoredLanguage();
			const newLanguage = current === 'id' ? 'en' : 'id';
			if (browser) {
				localStorage.setItem('app-language', newLanguage);
			}
			set(newLanguage);
		}
	};
};

export const currentLanguage = createLanguageStore();

// Translation dictionary
export const translations = {
	id: {
		// Navigation
		'nav.home': 'Beranda',
		'nav.quran': 'Al-Quran',
		'nav.bookmarks': 'Bookmark',
		'nav.prayer-times': 'Waktu Sholat',
		'nav.settings': 'Pengaturan',

		// Bookmarks
		'bookmarks.title': 'Bookmark Ayat',
		'bookmarks.subtitle': 'Kumpulan ayat-ayat favorit yang telah Anda simpan',
		'bookmarks.stats.total': 'Total Bookmark',
		'bookmarks.stats.surahs': 'Surah',
		'bookmarks.count': '{count} bookmark',
		'bookmarks.noResults': 'Tidak ada hasil ditemukan',
		'bookmarks.resultsCount': 'Menampilkan {count} dari {total} bookmark',
		'bookmarks.empty.title': 'Belum Ada Bookmark',
		'bookmarks.empty.subtitle': 'Anda belum menyimpan ayat apapun. Mulai membaca Al-Quran dan bookmark ayat favorit Anda.',
		'bookmarks.empty.search.title': 'Tidak Ada Hasil',
		'bookmarks.empty.search.subtitle': 'Tidak ditemukan bookmark yang sesuai dengan pencarian "{query}".',
		'bookmarks.search.placeholder': 'Cari dalam bookmark (ayat, terjemahan, catatan...)',
		'bookmarks.filter.toggle': 'Filter & Urutkan',
		'bookmarks.filter.title': 'Filter',
		'bookmarks.filter.surah': 'Filter berdasarkan Surah',
		'bookmarks.filter.allSurahs': 'Semua Surah',
		'bookmarks.filter.clear': 'Hapus Filter',
		'bookmarks.sort.title': 'Urutkan',
		'bookmarks.sort.date': 'Tanggal',
		'bookmarks.sort.surah': 'Surah',
		'bookmarks.sort.verse': 'Ayat',
		'bookmarks.card.verse': 'Ayat',
		'bookmarks.card.translation': 'Terjemahan',
		'bookmarks.card.personalNote': 'Catatan Pribadi',
		'bookmarks.card.addNote': 'Tambahkan catatan untuk ayat ini...',
		'bookmarks.card.noNote': 'Belum ada catatan',
		'bookmarks.card.editNote': 'Edit catatan',
		'bookmarks.card.save': 'Simpan',
		'bookmarks.card.cancel': 'Batal',
		'bookmarks.card.goToVerse': 'Buka Ayat',
		'bookmarks.card.delete': 'Hapus',
		'bookmarks.how.title': 'Cara Bookmark Ayat',
		'bookmarks.how.step1': 'Buka halaman surah yang ingin dibaca',
		'bookmarks.how.step2': 'Klik ikon bookmark (🔖) pada ayat yang diinginkan',
		'bookmarks.how.step3': 'Ayat akan tersimpan dan bisa diakses di halaman ini',

		// Common actions
		'action.start_reading': 'Mulai Membaca',
		'action.search': 'Cari',
		'action.filter': 'Filter',
		'action.reset_search': 'Reset Pencarian',
		'action.bookmark': 'Bookmark',
		'action.remove_bookmark': 'Hapus Bookmark',
		'action.copy': 'Salin',
		'action.share': 'Bagikan',
		'action.play': 'Putar',
		'action.pause': 'Jeda',
		'action.edit': 'Edit',
		'action.delete': 'Hapus',
		'action.save': 'Simpan',
		'action.cancel': 'Batal',

		// Quran
		'quran.surah': 'Surah',
		'quran.verse': 'Ayat',
		'quran.verses': 'ayat',
		'quran.arabic_text': 'Teks Arab',
		'quran.transliteration': 'Transliterasi',
		'quran.translation': 'Terjemahan',

		// Notifications
		'notification.bookmark.added': 'Ayat {verse} dari Surah {surah} telah ditambahkan ke bookmark',
		'notification.bookmark.removed': 'Ayat {verse} dari Surah {surah} telah dihapus dari bookmark',
		'notification.copied': 'Ayat telah disalin ke clipboard',

		// Settings
		'settings.title': 'Pengaturan',
		'settings.theme': 'Tema',
		'settings.theme.light': 'Terang',
		'settings.theme.dark': 'Gelap',
		'settings.theme.system': 'Sistem',
		'settings.language': 'Bahasa',
		'settings.language.id': 'Bahasa Indonesia',
		'settings.language.en': 'English',

		// Time
		'time.morning': 'Pagi',
		'time.afternoon': 'Siang',
		'time.evening': 'Sore',
		'time.night': 'Malam',

		// Search tips
		'search.tips': 'Tips Pencarian:',
		'search.tip1': 'Coba kata kunci yang berbeda',
		'search.tip2': 'Gunakan kata kunci yang lebih umum',
		'search.tip3': 'Periksa ejaan kata kunci',
	},
	
	en: {
		// Navigation
		'nav.home': 'Home',
		'nav.quran': 'Quran',
		'nav.bookmarks': 'Bookmarks',
		'nav.prayer-times': 'Prayer Times',
		'nav.settings': 'Settings',

		// Bookmarks
		'bookmarks.title': 'Bookmarked Verses',
		'bookmarks.subtitle': 'Your collection of favorite verses',
		'bookmarks.stats.total': 'Total Bookmarks',
		'bookmarks.stats.surahs': 'Surah',
		'bookmarks.count': '{count} bookmarks',
		'bookmarks.noResults': 'No results found',
		'bookmarks.resultsCount': 'Showing {count} of {total} bookmarks',
		'bookmarks.empty.title': 'No Bookmarks Yet',
		'bookmarks.empty.subtitle': 'You haven\'t saved any verses yet. Start reading the Quran and bookmark your favorite verses.',
		'bookmarks.empty.search.title': 'No Results Found',
		'bookmarks.empty.search.subtitle': 'No bookmarks found matching the search "{query}".',
		'bookmarks.search.placeholder': 'Search bookmarks (verses, translations, notes...)',
		'bookmarks.filter.toggle': 'Filter & Sort',
		'bookmarks.filter.title': 'Filter',
		'bookmarks.filter.surah': 'Filter by Surah',
		'bookmarks.filter.allSurahs': 'All Surahs',
		'bookmarks.filter.clear': 'Clear Filter',
		'bookmarks.sort.title': 'Sort by',
		'bookmarks.sort.date': 'Date',
		'bookmarks.sort.surah': 'Surah',
		'bookmarks.sort.verse': 'Verse',
		'bookmarks.card.verse': 'Verse',
		'bookmarks.card.translation': 'Translation',
		'bookmarks.card.personalNote': 'Personal Note',
		'bookmarks.card.addNote': 'Add a note for this verse...',
		'bookmarks.card.noNote': 'No notes yet',
		'bookmarks.card.editNote': 'Edit note',
		'bookmarks.card.save': 'Save',
		'bookmarks.card.cancel': 'Cancel',
		'bookmarks.card.goToVerse': 'Open Verse',
		'bookmarks.card.delete': 'Delete',
		'bookmarks.how.title': 'How to Bookmark Verses',
		'bookmarks.how.step1': 'Open the surah page you want to read',
		'bookmarks.how.step2': 'Click the bookmark icon (🔖) on the desired verse',
		'bookmarks.how.step3': 'The verse will be saved and accessible on this page',

		// Common actions
		'action.start_reading': 'Start Reading',
		'action.search': 'Search',
		'action.filter': 'Filter',
		'action.reset_search': 'Reset Search',
		'action.bookmark': 'Bookmark',
		'action.remove_bookmark': 'Remove Bookmark',
		'action.copy': 'Copy',
		'action.share': 'Share',
		'action.play': 'Play',
		'action.pause': 'Pause',
		'action.edit': 'Edit',
		'action.delete': 'Delete',
		'action.save': 'Save',
		'action.cancel': 'Cancel',

		// Quran
		'quran.surah': 'Surah',
		'quran.verse': 'Verse',
		'quran.verses': 'verses',
		'quran.arabic_text': 'Arabic Text',
		'quran.transliteration': 'Transliteration',
		'quran.translation': 'Translation',

		// Notifications
		'notification.bookmark.added': 'Verse {verse} from Surah {surah} has been bookmarked',
		'notification.bookmark.removed': 'Verse {verse} from Surah {surah} has been removed from bookmarks',
		'notification.copied': 'Verse copied to clipboard',

		// Settings
		'settings.title': 'Settings',
		'settings.theme': 'Theme',
		'settings.theme.light': 'Light',
		'settings.theme.dark': 'Dark',
		'settings.theme.system': 'System',
		'settings.language': 'Language',
		'settings.language.id': 'Bahasa Indonesia',
		'settings.language.en': 'English',

		// Time
		'time.morning': 'Morning',
		'time.afternoon': 'Afternoon',
		'time.evening': 'Evening',
		'time.night': 'Night',

		// Search tips
		'search.tips': 'Search tips:',
		'search.tip1': 'Try more general keywords',
		'search.tip2': 'Check keyword spelling',
		'search.tip3': 'Search by surah name or verse content',
	}
};

// Translation function with interpolation
export const t = derived(currentLanguage, ($language) => {
	return (key: string, params?: Record<string, string | number>) => {
		const translation = translations[$language][key as keyof typeof translations[typeof $language]] || key;
		
		if (!params) return translation;
		
		// Simple interpolation
		return Object.entries(params).reduce((text, [param, value]) => {
			return text.replace(`{${param}}`, String(value));
		}, translation);
	};
});

// Language utilities
export const languageUtils = {
	// Get available languages
	getAvailableLanguages: () => [
		{ code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
		{ code: 'en', name: 'English', flag: '🇺🇸' }
	],

	// Get current language info
	getCurrentLanguageInfo: (language: Language) => {
		const languages = languageUtils.getAvailableLanguages();
		return languages.find(lang => lang.code === language) || languages[0];
	},

	// Format date according to language
	formatDate: (date: string | Date, language: Language) => {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		const locale = language === 'id' ? 'id-ID' : 'en-US';
		
		return dateObj.toLocaleDateString(locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	},

	// Get RTL direction (for future Arabic support)
	getDirection: (_language: Language) => 'ltr', // Currently all supported languages are LTR

	// Apply language to document
	applyLanguage: (language: Language) => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = language;
			document.documentElement.dir = languageUtils.getDirection(language);
		}
	}
};

// Initialize language system
export const initializeLanguage = () => {
	currentLanguage.subscribe(language => {
		languageUtils.applyLanguage(language);
	});
};
