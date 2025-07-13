import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { translations, type Language } from './locales';

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

// Helper function to get nested translation key
const getNestedTranslation = (obj: any, path: string): string => {
	return path.split('.').reduce((current, key) => {
		return current && current[key] ? current[key] : null;
	}, obj) || path;
};

// Translation function with interpolation
export const t = derived(currentLanguage, ($language) => {
	return (key: string, params?: Record<string, string | number>) => {
		const translation = getNestedTranslation(translations[$language], key);
		
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
		{ code: 'id' as const, name: 'Bahasa Indonesia', flag: '🇮🇩' },
		{ code: 'en' as const, name: 'English', flag: '🇺🇸' }
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

// Re-export types and translations for convenience
export type { Language };
export { translations };
