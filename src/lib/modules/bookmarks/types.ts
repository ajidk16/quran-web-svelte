export interface Bookmark {
	id: string;
	surah: number;
	surahName: string;
	surahNameLatin: string;
	verse: number;
	note?: string;
	timestamp: string;
	arabicText: string;
	translationText: string;
	transliterationText: string;
}

export interface BookmarkCreateData {
	surah: number;
	surahName: string;
	surahNameLatin: string;
	verse: number;
	note?: string;
	arabicText: string;
	translationText: string;
	transliterationText: string;
}

export interface BookmarkUpdateData {
	note?: string;
}
