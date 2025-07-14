import { writable, derived, get } from 'svelte/store';
import type { Bookmark } from './types';
import { bookmarkService } from './services';

// Store for bookmarks
export const bookmarks = writable<Bookmark[]>([]);

// Loading states
export const bookmarksLoading = writable(false);

// Derived store for reactive bookmark checking
export const bookmarkMap = derived(bookmarks, ($bookmarks) => {
	const map = new Map<string, Bookmark>();
	$bookmarks.forEach(bookmark => {
		const key = `${bookmark.surah}-${bookmark.verse}`;
		map.set(key, bookmark);
	});
	return map;
});

// Initialize bookmarks store
export function initializeBookmarks() {
	const savedBookmarks = bookmarkService.getAllBookmarks();
	bookmarks.set(savedBookmarks);
}

// Add bookmark
export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'timestamp'>) {
	const newBookmark = bookmarkService.addBookmark(bookmark);
	if (newBookmark) {
		bookmarks.update(items => [...items, newBookmark]);
		return newBookmark;
	}
	return null;
}

// Remove bookmark
export function removeBookmark(id: string) {
	const success = bookmarkService.removeBookmark(id);
	if (success) {
		bookmarks.update(items => items.filter(item => item.id !== id));
	}
	return success;
}

// Update bookmark note
export function updateBookmarkNote(id: string, note: string) {
	const updated = bookmarkService.updateBookmark(id, { note });
	if (updated) {
		bookmarks.update(items => 
			items.map(item => item.id === id ? { ...item, note } : item)
		);
	}
	return updated;
}

// Check if verse is bookmarked (reactive version)
export function isBookmarked(surah: number, verse: number): boolean {
	const currentBookmarks = get(bookmarks);
	return currentBookmarks.some(bookmark => 
		bookmark.surah === surah && bookmark.verse === verse
	);
}

// Check if verse is bookmarked with reactive store
export function isBookmarkedReactive(surah: number, verse: number) {
	return derived(bookmarkMap, ($bookmarkMap) => {
		const key = `${surah}-${verse}`;
		return $bookmarkMap.has(key);
	});
}

// Get bookmark by surah and verse
export function getBookmarkByVerse(surah: number, verse: number): Bookmark | null {
	return bookmarkService.getBookmarkByVerse(surah, verse);
}

// Toggle bookmark for a verse
export function toggleBookmark(data: Omit<Bookmark, 'id' | 'timestamp'>) {
	const existing = getBookmarkByVerse(data.surah, data.verse);
	
	if (existing) {
		removeBookmark(existing.id);
		return false; // removed
	} else {
		addBookmark(data);
		return true; // added
	}
}
