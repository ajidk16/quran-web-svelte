// Main i18n module - re-exports from the new i18n folder structure
// This maintains backward compatibility for existing imports

export {
	currentLanguage,
	t,
	languageUtils,
	initializeLanguage,
	translations
} from './i18n/index';

export type { Language } from './i18n/index';
