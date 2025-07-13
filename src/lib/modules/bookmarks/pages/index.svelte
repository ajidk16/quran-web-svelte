<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { bookmarks, initializeBookmarks, removeBookmark, updateBookmarkNote } from '../store';
	import { bookmarkService } from '../services';
	import BookmarkCard from '../components/BookmarkCard.svelte';
	import SearchFilter from '../components/SearchFilter.svelte';
	import EmptyState from '../components/EmptyState.svelte';
	import type { Bookmark } from '../types';

	let searchQuery = '';
	let sortBy = 'timestamp';
	let sortOrder = 'desc';
	let filterBySurah = '';
	let filteredBookmarks: Bookmark[] = [];

	onMount(() => {
		initializeBookmarks();
		updateFilteredBookmarks();
	});

	// Reactive statement to update filtered bookmarks when bookmarks or filters change
	$: if ($bookmarks) {
		updateFilteredBookmarks();
	}

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
				default:
					aValue = a.timestamp;
					bValue = b.timestamp;
			}

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		filteredBookmarks = result;
	}

	function handleSearch(event: CustomEvent<string>) {
		searchQuery = event.detail;
		updateFilteredBookmarks();
	}

	function handleSort(event: CustomEvent<{ sortBy: string; sortOrder: string }>) {
		sortBy = event.detail.sortBy;
		sortOrder = event.detail.sortOrder;
		updateFilteredBookmarks();
	}

	function handleFilter(event: CustomEvent<{ filterBySurah: string }>) {
		filterBySurah = event.detail.filterBySurah;
		updateFilteredBookmarks();
	}

	function handleClear() {
		searchQuery = '';
		filterBySurah = '';
		sortBy = 'timestamp';
		sortOrder = 'desc';
		updateFilteredBookmarks();
	}

	function handleDeleteBookmark(event: CustomEvent<string>) {
		const id = event.detail;
		removeBookmark(id);
	}

	function handleUpdateNote(event: CustomEvent<{ id: string; note: string }>) {
		const { id, note } = event.detail;
		updateBookmarkNote(id, note);
	}

	function handleGoToVerse(event: CustomEvent<{ surah: number; verse: number }>) {
		const { surah, verse } = event.detail;
		goto(`/quran/${surah}#ayat-${verse}`);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-800 mb-2">Bookmark Ayat</h1>
			<p class="text-gray-600">
				Kumpulan ayat-ayat favorit yang telah Anda simpan
				{#if $bookmarks.length > 0}
					<span class="text-emerald-600 font-semibold">({$bookmarks.length} bookmark)</span>
				{/if}
			</p>
		</div>

		{#if $bookmarks.length > 0}
			<!-- Search and Filter -->
			<SearchFilter
				{searchQuery}
				{sortBy}
				{sortOrder}
				{filterBySurah}
				on:search={handleSearch}
				on:sort={handleSort}
				on:filter={handleFilter}
				on:clear={handleClear}
			/>

			<!-- Results Info -->
			{#if searchQuery || filterBySurah}
				<div class="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
					<p class="text-emerald-800">
						Menampilkan <strong>{filteredBookmarks.length}</strong> dari <strong>{$bookmarks.length}</strong> bookmark
						{#if searchQuery}
							untuk pencarian "<strong>{searchQuery}</strong>"
						{/if}
						{#if filterBySurah}
							dari Surah {filterBySurah}
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
