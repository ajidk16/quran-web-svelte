import { writable } from 'svelte/store';
import type { QuranAyatDto, Surah } from './types';

export type QuranState = {
	loading: boolean;
	error: string | null;
	surahs: Surah[];
	surah: Surah | null;
	detailSurah: QuranAyatDto[];
};

const STORAGE_KEY = 'quranStore';

function loadState(): QuranState {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // ignore parse error, fallback to initial
            }
        }
    }
    return {
        loading: false,
        error: null,
        surahs: [],
        surah: null,
        detailSurah: []
    };
}

const initialState: QuranState = loadState();

export const quranStore = writable<QuranState>(initialState);

if (typeof localStorage !== 'undefined') {
    quranStore.subscribe((state) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // ignore quota errors
        }
    });
}

export function updateQuran(partial: Partial<QuranState>) {
	quranStore.update((state) => ({ ...state, ...partial }));
}

export function resetQuran() {
	quranStore.set({
		loading: false,
		error: null,
		surahs: [],
		surah: null,
		detailSurah: []
	});
}
