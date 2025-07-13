<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { bookmarks, initializeBookmarks, removeBookmark, updateBookmarkNote } from '../store';
	import { bookmarkService } from '../services';
	import BookmarkCard from '../components/BookmarkCard.svelte';
	import SearchFilter from '../components/SearchFilter.svelte';
	import EmptyState from '../components/EmptyState.svelte';
	import type { Bookmark } from '../types';
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { t } from '$lib/utils/i18n';
	import { cn } from '$lib/utils';

	let searchQuery = $state('');
	let sortBy = $state('timestamp');
	let sortOrder = $state('desc');
	let filterBySurah = $state('');
	let filteredBookmarks = $state<Bookmark[]>([]);

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

	onMount(() => {
		initializeBookmarks();
		updateFilteredBookmarks();
	});

	// Effect to update filtered bookmarks when bookmarks or filters change
	$effect(() => {
		if ($bookmarks) {
			updateFilteredBookmarks();
		}
	});

	function updateFilteredBookmarks() {
		let result = [...$bookmarks];

		// Apply search filter
		if (searchQuery.trim()) {
			result = bookmarkService.searchBookmarks(searchQuery);
		}

		// Apply surah filter
		if (filterBySurah) {
			result = result.filter(bookmark => bookmark.surah.toString() === filterBySurah);
		}

		// Apply sorting
		result.sort((a, b) => {
			let aValue: any, bValue: any;

			switch (sortBy) {
				case 'timestamp':
					aValue = new Date(a.timestamp).getTime();
					bValue = new Date(b.timestamp).getTime();
					break;
				case 'surah':
					aValue = a.surah;
					bValue = b.surah;
					// Secondary sort by verse number
					if (aValue === bValue) {
						aValue = a.verse;
						bValue = b.verse;
					}
					break;
				case 'verse':
					aValue = a.verse;
					bValue = b.verse;
					break;
				case 'surahName':
					aValue = a.surahName.toLowerCase();
					bValue = b.surahName.toLowerCase();
					break;
				default:
					aValue = new Date(a.timestamp).getTime();
					bValue = new Date(b.timestamp).getTime();
			}

			if (sortOrder === 'asc') {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			}
		});

		filteredBookmarks = result;
	}

	function handleDeleteBookmark(event: CustomEvent<string>) {
		const id = event.detail;
		removeBookmark(id);
		updateFilteredBookmarks();
	}

	function handleUpdateNote(event: CustomEvent<{ id: string; note: string }>) {
		const { id, note } = event.detail;
		updateBookmarkNote(id, note);
		updateFilteredBookmarks();
	}

	function handleGoToVerse(event: CustomEvent<{ surah: number; verse: number }>) {
		const { surah, verse } = event.detail;
		goto(`/quran/${surah}?verse=${verse}`);
	}

	function handleSearch(event: CustomEvent<string>) {
		searchQuery = event.detail;
		updateFilteredBookmarks();
	}

	function handleSortChange(event: CustomEvent<{ sortBy: string; sortOrder: string }>) {
		const { sortBy: newSortBy, sortOrder: newSortOrder } = event.detail;
		sortBy = newSortBy;
		sortOrder = newSortOrder;
		updateFilteredBookmarks();
	}

	function handleFilterChange(event: CustomEvent<string>) {
		filterBySurah = event.detail;
		updateFilteredBookmarks();
	}

	// Get unique surahs for filter dropdown
	const uniqueSurahs = $derived(
		Array.from(new Set($bookmarks.map(bookmark => bookmark.surah))).sort((a, b) => a - b)
	);
</script>

<svelte:head>
	<title>{$t('bookmarks.title')} - Quran Web</title>
</svelte:head>

<div class={cn("min-h-screen", themeClasses.bgPrimary)}>
	<div class="max-w-6xl mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class={cn("text-4xl font-bold mb-2", themeClasses.textPrimary)}>
				{$t('bookmarks.title')}
			</h1>
			<p class={cn("text-lg", themeClasses.textSecondary)}>
				{$t('bookmarks.subtitle')}
			</p>
		</div>

		{#if $bookmarks.length > 0}
			<!-- Search and Filter -->
			<div class="mb-8">
				<SearchFilter
					{searchQuery}
					{sortBy}
					{sortOrder}
					{filterBySurah}
					on:search={handleSearch}
					on:sortChange={handleSortChange}
					on:filterChange={handleFilterChange}
				/>
			</div>

			<!-- Results Count -->
			{#if searchQuery || filterBySurah}
				<div class="mb-6">
					<p class={cn("text-sm", themeClasses.textSecondary)}>
						{#if filteredBookmarks.length === 0}
							{$t('bookmarks.noResults')}
						{:else}
							{$t('bookmarks.resultsCount', { count: filteredBookmarks.length, total: $bookmarks.length })}
						{/if}
					</p>
				</div>
			{/if}

			<!-- Bookmarks Grid -->
			{#if filteredBookmarks.length > 0}
				<div class="grid gap-6 md:gap-8">
					{#each filteredBookmarks as bookmark (bookmark.id)}
						<BookmarkCard
							{bookmark}
							on:delete={handleDeleteBookmark}
							on:updateNote={handleUpdateNote}
							on:goToVerse={handleGoToVerse}
						/>
					{/each}
				</div>
			{:else}
				<!-- No results found -->
				<EmptyState {searchQuery} />
			{/if}
		{:else}
			<!-- Empty state -->
			<EmptyState />
		{/if}
	</div>
</div>
