<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Search, Filter, X, Calendar, BookOpen, SortAsc, SortDesc } from '@lucide/svelte';
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { t } from '$lib/utils/i18n';
	import { cn } from '$lib/utils';

	export let searchQuery = '';
	export let sortBy = 'timestamp'; // timestamp, surah, verse
	export let sortOrder = 'desc'; // asc, desc
	export let filterBySurah = '';

	const dispatch = createEventDispatcher();

	let showFilters = false;

	$: themeClasses = themeUtils.getThemeClasses($currentTheme);

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		dispatch('search', searchQuery);
	}

	function handleSortChange(newSortBy: string) {
		if (sortBy === newSortBy) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = newSortBy;
			sortOrder = 'desc';
		}
		dispatch('sortChange', { sortBy, sortOrder });
	}

	function handleFilterChange() {
		dispatch('filterChange', filterBySurah);
	}

	function clearFilters() {
		searchQuery = '';
		filterBySurah = '';
		sortBy = 'timestamp';
		sortOrder = 'desc';
		dispatch('search', '');
		dispatch('filterChange', '');
		dispatch('sortChange', { sortBy, sortOrder });
	}

	function toggleFilters() {
		showFilters = !showFilters;
	}

	// List of Surahs for filter dropdown (simplified)
	const surahs = [
		{ number: 1, name: 'Al-Fatihah' },
		{ number: 2, name: 'Al-Baqarah' },
		{ number: 3, name: 'Ali \'Imran' },
		{ number: 4, name: 'An-Nisa' },
		{ number: 5, name: 'Al-Maidah' },
		// Add more surahs as needed
	];
</script>

<div class="space-y-6">
	<!-- Search Bar with improved design -->
	<div class="flex flex-col sm:flex-row gap-4">
		<div class="flex-1 relative group">
			<Search size={20} class={cn(
				"absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors",
				searchQuery ? "text-emerald-500" : "text-gray-400"
			)} />
			<input
				type="text"
				placeholder={$t('bookmarks.search.placeholder')}
				value={searchQuery}
				on:input={handleSearch}
				class={cn(
					"w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200",
					"focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500",
					"bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
					"placeholder:text-gray-400 dark:placeholder:text-gray-500",
					themeClasses.textPrimary,
					themeClasses.border
				)}
			/>
			{#if searchQuery}
				<button
					on:click={() => {
						searchQuery = '';
						dispatch('search', '');
					}}
					class="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				>
					<X size={16} class="text-gray-400" />
				</button>
			{/if}
		</div>
		
		<!-- Filter Toggle Button -->
		<button
			on:click={toggleFilters}
			class={cn(
				"flex items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium",
				showFilters 
					? "bg-emerald-500 text-white border-emerald-500 shadow-lg"
					: "hover:border-emerald-300 dark:hover:border-emerald-600",
				!showFilters && themeClasses.border,
				!showFilters && themeClasses.textPrimary
			)}
		>
			<Filter size={18} />
			<span class="hidden sm:inline">{$t('bookmarks.filter.toggle')}</span>
		</button>
	</div>

	<!-- Filters Panel -->
	{#if showFilters}
		<div class={cn(
			"p-6 border-2 border-dashed rounded-xl transition-all duration-300",
			"bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20",
			"border-emerald-200 dark:border-emerald-700/50"
		)}>
			<div class="space-y-6">
				<!-- Sort Options -->
				<div>
					<div class="flex items-center gap-2 mb-4">
						<div class="w-2 h-2 rounded-full bg-emerald-500"></div>
						<h3 class={cn("text-sm font-semibold uppercase tracking-wide", themeClasses.textSecondary)}>
							{$t('bookmarks.sort.title')}
						</h3>
					</div>
					<div class="flex flex-wrap gap-3">
						<button
							on:click={() => handleSortChange('timestamp')}
							class={cn(
								"flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium",
								sortBy === 'timestamp' 
									? "bg-emerald-500 text-white border-emerald-500 shadow-lg" 
									: "hover:border-emerald-300 dark:hover:border-emerald-600",
								sortBy !== 'timestamp' && themeClasses.border,
								sortBy !== 'timestamp' && themeClasses.textPrimary
							)}
						>
							<Calendar size={16} />
							<span>{$t('bookmarks.sort.date')}</span>
							{#if sortBy === 'timestamp'}
								{#if sortOrder === 'asc'}
									<SortAsc size={16} />
								{:else}
									<SortDesc size={16} />
								{/if}
							{/if}
						</button>
						
						<button
							on:click={() => handleSortChange('surah')}
							class={cn(
								"flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium",
								sortBy === 'surah' 
									? "bg-emerald-500 text-white border-emerald-500 shadow-lg" 
									: "hover:border-emerald-300 dark:hover:border-emerald-600",
								sortBy !== 'surah' && themeClasses.border,
								sortBy !== 'surah' && themeClasses.textPrimary
							)}
						>
							<BookOpen size={16} />
							<span>{$t('bookmarks.sort.surah')}</span>
							{#if sortBy === 'surah'}
								{#if sortOrder === 'asc'}
									<SortAsc size={16} />
								{:else}
									<SortDesc size={16} />
								{/if}
							{/if}
						</button>
					</div>
				</div>

				<!-- Surah Filter -->
				<div>
					<div class="flex items-center gap-2 mb-4">
						<div class="w-2 h-2 rounded-full bg-blue-500"></div>
						<h3 class={cn("text-sm font-semibold uppercase tracking-wide", themeClasses.textSecondary)}>
							{$t('bookmarks.filter.surah')}
						</h3>
					</div>
					<select
						bind:value={filterBySurah}
						on:change={handleFilterChange}
						class={cn(
							"w-full px-4 py-3 border-2 rounded-xl transition-all duration-200",
							"focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500",
							"bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
							themeClasses.textPrimary,
							themeClasses.border
						)}
					>
						<option value="">{$t('bookmarks.filter.allSurahs')}</option>
						{#each surahs as surah}
							<option value={surah.number.toString()}>
								{surah.number}. {surah.name}
							</option>
						{/each}
					</select>
				</div>

				<!-- Clear Filters Button -->
				<div class="flex justify-end">
					<button
						on:click={clearFilters}
						class={cn(
							"flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium",
							"hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-600",
							"text-red-600 dark:text-red-400",
							themeClasses.border
						)}
					>
						<X size={16} />
						<span>{$t('bookmarks.filter.clear')}</span>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
