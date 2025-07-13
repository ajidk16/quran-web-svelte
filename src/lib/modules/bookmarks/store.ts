import { writable } from 'svelte/store';
import type { Bookmark } from './types';
import { bookmarkService } from './services';

// Store for bookmarks
export const bookmarks = writable<Bookmark[]>([]);

// Loading states
export const bookmarksLoading = writable(false);

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

// Check if verse is bookmarked
export function isBookmarked(surah: number, verse: number): boolean {
	return bookmarkService.isBookmarked(surah, verse);
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
