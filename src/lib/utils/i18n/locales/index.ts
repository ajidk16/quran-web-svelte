import idTranslations from './id.json';
import enTranslations from './en.json';

export type Language = 'id' | 'en';

export const translations = {
	id: idTranslations,
	en: enTranslations
} as const;

export { idTranslations, enTranslations };
