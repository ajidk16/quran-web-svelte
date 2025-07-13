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

<div class={cn("min-h-screen transition-colors duration-200", themeClasses.bgPrimary)}>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header Section with improved typography and spacing -->
		<div class="mb-12">
			<div class="text-center mb-8">
				<h1 class={cn("text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight", themeClasses.textPrimary)}>
					{$t('bookmarks.title')}
				</h1>
				<p class={cn("text-lg md:text-xl max-w-2xl mx-auto leading-relaxed", themeClasses.textSecondary)}>
					{$t('bookmarks.subtitle')}
				</p>
			</div>
			
			<!-- Stats Bar -->
			{#if $bookmarks.length > 0}
				<div class={cn(
					"rounded-xl p-6 mb-8 border backdrop-blur-sm transition-colors duration-200",
					themeClasses.card,
					themeClasses.border,
					$currentTheme === 'dark' 
						? "bg-gradient-to-r from-emerald-900/20 to-blue-900/20" 
						: "bg-gradient-to-r from-emerald-50 to-blue-50"
				)}>
					<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div class="flex items-center gap-6">
							<div class="text-center">
								<div class={cn("text-2xl font-bold", themeClasses.textPrimary)}>
									{$bookmarks.length}
								</div>
								<div class={cn("text-sm font-medium", themeClasses.textSecondary)}>
									{$t('bookmarks.stats.total')}
								</div>
							</div>
							<div class={cn("w-px h-12 bg-gradient-to-b", themeClasses.border)}></div>
							<div class="text-center">
								<div class={cn(
									"text-2xl font-bold",
									$currentTheme === 'dark' ? "text-emerald-400" : "text-emerald-600"
								)}>
									{new Set($bookmarks.map(b => b.surah)).size}
								</div>
								<div class={cn("text-sm font-medium", themeClasses.textSecondary)}>
									{$t('bookmarks.stats.surahs')}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		{#if $bookmarks.length > 0}
			<!-- Search and Filter Section with improved design -->
			<div class="mb-8">
				<div class={cn(
					"rounded-xl p-6 border shadow-sm backdrop-blur-sm transition-colors duration-200",
					themeClasses.card,
					themeClasses.border
				)}>
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
			</div>

			<!-- Results Count with improved styling -->
			{#if searchQuery || filterBySurah}
				<div class="mb-6">
					<div class={cn(
						"inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
						filteredBookmarks.length === 0 
							? $currentTheme === 'dark'
								? "bg-red-900/30 text-red-400 border border-red-800/50"
								: "bg-red-100 text-red-700 border border-red-200"
							: $currentTheme === 'dark'
								? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50"
								: "bg-emerald-100 text-emerald-700 border border-emerald-200"
					)}>
						{#if filteredBookmarks.length === 0}
							<span class="mr-2">🔍</span>
							{$t('bookmarks.noResults')}
						{:else}
							<span class="mr-2">✓</span>
							{$t('bookmarks.resultsCount', { count: filteredBookmarks.length, total: $bookmarks.length })}
						{/if}
					</div>
				</div>
			{/if}

			<!-- Bookmarks Grid with improved layout -->
			{#if filteredBookmarks.length > 0}
				<div class="space-y-6">
					{#each filteredBookmarks as bookmark, index (bookmark.id)}
						<div class="animate-in slide-in-from-top-4 duration-300">
							<BookmarkCard
								{bookmark}
								on:delete={handleDeleteBookmark}
								on:updateNote={handleUpdateNote}
								on:goToVerse={handleGoToVerse}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<!-- No results found with improved styling -->
				<div class="animate-in fade-in duration-300">
					<EmptyState {searchQuery} />
				</div>
			{/if}
		{:else}
			<!-- Empty state with improved design -->
			<div class="animate-in fade-in duration-500">
				<EmptyState />
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes slideInFromTop {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-in {
		animation-fill-mode: both;
	}

	.slide-in-from-top-4 {
		animation: slideInFromTop 0.3s ease-out;
	}

	.fade-in {
		animation: fadeIn 0.3s ease-out;
	}
</style>
