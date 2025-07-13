import type { Bookmark, BookmarkCreateData, BookmarkUpdateData } from './types';

class BookmarkService {
	private storageKey = 'quran-bookmarks';

	// Get all bookmarks from localStorage
	getAllBookmarks(): Bookmark[] {
		try {
			const stored = localStorage.getItem(this.storageKey);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Error getting bookmarks:', error);
			return [];
		}
	}

	// Save bookmarks to localStorage
	private saveBookmarks(bookmarks: Bookmark[]): void {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
		} catch (error) {
			console.error('Error saving bookmarks:', error);
		}
	}

	// Generate unique ID for bookmark
	private generateId(): string {
		return `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	// Add a new bookmark
	addBookmark(data: BookmarkCreateData): Bookmark | null {
		try {
			const bookmarks = this.getAllBookmarks();
			
			// Check if already bookmarked
			const existing = bookmarks.find(b => b.surah === data.surah && b.verse === data.verse);
			if (existing) {
				console.warn('Verse already bookmarked');
				return existing;
			}

			const newBookmark: Bookmark = {
				id: this.generateId(),
				...data,
				timestamp: new Date().toISOString()
			};

			bookmarks.push(newBookmark);
			this.saveBookmarks(bookmarks);
			return newBookmark;
		} catch (error) {
			console.error('Error adding bookmark:', error);
			return null;
		}
	}

	// Remove a bookmark
	removeBookmark(id: string): boolean {
		try {
			const bookmarks = this.getAllBookmarks();
			const filtered = bookmarks.filter(b => b.id !== id);
			
			if (filtered.length === bookmarks.length) {
				return false; // Bookmark not found
			}

			this.saveBookmarks(filtered);
			return true;
		} catch (error) {
			console.error('Error removing bookmark:', error);
			return false;
		}
	}

	// Update bookmark
	updateBookmark(id: string, data: BookmarkUpdateData): boolean {
		try {
			const bookmarks = this.getAllBookmarks();
			const index = bookmarks.findIndex(b => b.id === id);
			
			if (index === -1) {
				return false; // Bookmark not found
			}

			bookmarks[index] = { ...bookmarks[index], ...data };
			this.saveBookmarks(bookmarks);
			return true;
		} catch (error) {
			console.error('Error updating bookmark:', error);
			return false;
		}
	}

	// Check if a verse is bookmarked
	isBookmarked(surah: number, verse: number): boolean {
		const bookmarks = this.getAllBookmarks();
		return bookmarks.some(b => b.surah === surah && b.verse === verse);
	}

	// Get bookmark by surah and verse
	getBookmarkByVerse(surah: number, verse: number): Bookmark | null {
		const bookmarks = this.getAllBookmarks();
		return bookmarks.find(b => b.surah === surah && b.verse === verse) || null;
	}

	// Get bookmarks by surah
	getBookmarksBySurah(surah: number): Bookmark[] {
		const bookmarks = this.getAllBookmarks();
		return bookmarks.filter(b => b.surah === surah);
	}

	// Search bookmarks
	searchBookmarks(query: string): Bookmark[] {
		const bookmarks = this.getAllBookmarks();
		const lowercaseQuery = query.toLowerCase();
		
		return bookmarks.filter(bookmark => 
			bookmark.surahName.toLowerCase().includes(lowercaseQuery) ||
			bookmark.surahNameLatin.toLowerCase().includes(lowercaseQuery) ||
			bookmark.arabicText.toLowerCase().includes(lowercaseQuery) ||
			bookmark.translationText.toLowerCase().includes(lowercaseQuery) ||
			bookmark.transliterationText.toLowerCase().includes(lowercaseQuery) ||
			bookmark.note?.toLowerCase().includes(lowercaseQuery)
		);
	}

	// Clear all bookmarks
	clearAllBookmarks(): void {
		try {
			localStorage.removeItem(this.storageKey);
		} catch (error) {
			console.error('Error clearing bookmarks:', error);
		}
	}
}

export const bookmarkService = new BookmarkService();
