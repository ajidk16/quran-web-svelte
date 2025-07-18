<script lang="ts">
	import { MapPin, Navigation } from '@lucide/svelte';
	import type { SelectedCity } from '../utils/location';
	import type { LokasiData } from '../types';

	interface Props {
		show: boolean;
		searchKeyword: string;
		searchResults: LokasiData[];
		isLoading: boolean;
		isGettingLocation: boolean;
		onClose: () => void;
		onSearch: (keyword: string) => void;
		onSelectCity: (city: SelectedCity) => void;
		onGetLocation: () => void;
	}

	let {
		show = $bindable(),
		searchKeyword = $bindable(),
		searchResults,
		isLoading,
		isGettingLocation,
		onClose,
		onSearch,
		onSelectCity,
		onGetLocation
	}: Props = $props();

	let searchInput = $state<HTMLInputElement>();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			onSearch(searchKeyword);
		}
	}

	// Focus search input when modal opens
	$effect(() => {
		if (show && searchInput) {
			setTimeout(() => searchInput?.focus(), 100);
		}
	});
</script>

{#if show}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
		<div
			class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
		>
			<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
				<h3 class="text-lg font-semibold">🔍 Cari Kota</h3>
			</div>

			<div class="p-6">
				<div class="flex gap-2 mb-4">
					<input
						bind:this={searchInput}
						bind:value={searchKeyword}
						placeholder="Masukkan nama kota..."
						class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						onkeydown={handleKeydown}
					/>
					<button
						onclick={() => onSearch(searchKeyword)}
						class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
						disabled={isLoading}
					>
						{isLoading ? '...' : 'Cari'}
					</button>
				</div>

				<!-- Search Results -->
				{#if searchResults.length > 0}
					<div
						class="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg"
					>
						{#each searchResults as city}
							<button
								onclick={() => onSelectCity(city)}
								class="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors text-gray-900 dark:text-white"
							>
								<div class="flex items-center gap-2">
									<MapPin size={16} class="text-gray-400 dark:text-gray-500" />
									<span>{city.lokasi}</span>
								</div>
							</button>
						{/each}
					</div>
				{:else if searchKeyword && !isLoading}
					<div class="text-center py-4 text-gray-500 dark:text-gray-400">
						Tidak ada hasil untuk "{searchKeyword}"
					</div>
				{/if}

				<div class="flex gap-2 mt-6">
					<button
						onclick={onGetLocation}
						class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						disabled={isLoading || isGettingLocation}
					>
						{#if isGettingLocation}
							<div
								class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
							></div>
						{:else}
							<Navigation size={16} />
						{/if}
						{isGettingLocation ? 'Mencari...' : 'Lokasi Saya'}
					</button>
					<button
						onclick={onClose}
						class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
