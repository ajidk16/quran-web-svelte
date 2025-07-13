// Re-export bookmark functionality for easy access
export { bookmarkService } from './services';
export { 
	bookmarks,
	bookmarksLoading,
	initializeBookmarks,
	addBookmark,
	removeBookmark,
	updateBookmarkNote,
	isBookmarked,
	getBookmarkByVerse,
	toggleBookmark
} from './store';

export type { 
	Bookmark, 
	BookmarkCreateData, 
	BookmarkUpdateData 
} from './types';
