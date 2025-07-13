<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Search, Filter, X, Calendar, BookOpen, SortAsc, SortDesc } from '@lucide/svelte';

	export let searchQuery = '';
	export let sortBy = 'timestamp'; // timestamp, surah, verse
	export let sortOrder = 'desc'; // asc, desc
	export let filterBySurah = '';

	const dispatch = createEventDispatcher();

	let showFilters = false;

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
		dispatch('sort', { sortBy, sortOrder });
	}

	function handleFilterChange() {
		dispatch('filter', { filterBySurah });
	}

	function clearFilters() {
		searchQuery = '';
		filterBySurah = '';
		sortBy = 'timestamp';
		sortOrder = 'desc';
		dispatch('clear');
	}

	function toggleFilters() {
		showFilters = !showFilters;
	}

	// List of Surahs for filter dropdown (simplified - you can expand this)
	const surahs = [
		{ number: 1, name: 'Al-Fatihah' },
		{ number: 2, name: 'Al-Baqarah' },
		{ number: 3, name: 'Ali \'Imran' },
		{ number: 4, name: 'An-Nisa' },
		{ number: 5, name: 'Al-Maidah' },
		// Add more surahs as needed
	];
</script>

<div class="bg-white rounded-lg shadow-md p-6 mb-6">
	<!-- Search Bar -->
	<div class="flex flex-col sm:flex-row gap-4 mb-4">
		<div class="flex-1 relative">
			<Search size={20} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				placeholder="Cari dalam bookmark (ayat, terjemahan, catatan...)"
				value={searchQuery}
				on:input={handleSearch}
				class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
			/>
			{#if searchQuery}
				<button
					on:click={clearFilters}
					class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
				>
					<X size={20} />
				</button>
			{/if}
		</div>
		
		<button
			on:click={toggleFilters}
			class="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
		>
			<Filter size={20} />
			<span>Filter</span>
		</button>
	</div>

	<!-- Filters Panel -->
	{#if showFilters}
		<div class="border-t border-gray-200 pt-4 space-y-4">
			<!-- Sort Options -->
			<div>
				<p class="block text-sm font-medium text-gray-700 mb-2">Urutkan berdasarkan:</p>
				<div class="flex flex-wrap gap-2">
					<button
						on:click={() => handleSortChange('timestamp')}
						class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors {sortBy === 'timestamp' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
					>
						<Calendar size={16} />
						<span>Tanggal</span>
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
						class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors {sortBy === 'surah' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
					>
						<BookOpen size={16} />
						<span>Surah</span>
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
				<label for="surahFilter" class="block text-sm font-medium text-gray-700 mb-2">
					Filter berdasarkan Surah:
				</label>
				<select
					id="surahFilter"
					bind:value={filterBySurah}
					on:change={handleFilterChange}
					class="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
				>
					<option value="">Semua Surah</option>
					{#each surahs as surah}
						<option value={surah.number.toString()}>{surah.number}. {surah.name}</option>
					{/each}
				</select>
			</div>

			<!-- Clear Filters -->
			{#if searchQuery || filterBySurah || sortBy !== 'timestamp' || sortOrder !== 'desc'}
				<div class="flex justify-between items-center pt-2 border-t border-gray-100">
					<span class="text-sm text-gray-500">Filter aktif</span>
					<button
						on:click={clearFilters}
						class="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
					>
						Reset semua filter
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
