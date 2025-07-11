<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import type { QuranDataDto } from '../types';

	export let show: boolean = false;
	export let surah: QuranDataDto | null = null;
	export let searchQuery: string = '';
	export let filteredAyats: any[] = [];
	export let showSearchResults: boolean = false;
	export let showAdvancedFilter: boolean = false;
	export let filterByRange: boolean = false;
	export let rangeStart: number = 1;
	export let rangeEnd: number = 1;

	const dispatch = createEventDispatcher();

	function closeModal() {
		show = false;
		dispatch('close');
	}

	function clearSearch() {
		searchQuery = '';
		filteredAyats = [];
		showSearchResults = false;
		showAdvancedFilter = false;
		filterByRange = false;
		if (surah?.jumlahAyat) {
			rangeStart = 1;
			rangeEnd = surah.jumlahAyat;
		}
		dispatch('clearSearch');
	}

	function scrollToAyat(ayatNum: number) {
		dispatch('scrollToAyat', { ayatNum });
		closeModal();
	}

	function highlightText(text: string, query: string): string {
		if (!query.trim()) return text;
		const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
	}

	// Auto-focus search input when modal opens
	$: if (show && browser) {
		setTimeout(() => {
			const searchInput = document.getElementById('modal-ayat-search');
			if (searchInput) {
				searchInput.focus();
			}
		}, 100);
	}
</script>

{#if show}
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		role="button"
		tabindex="0"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				closeModal();
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape' || (e.key === 'Enter' && e.target === e.currentTarget)) {
				closeModal();
			}
		}}
	>
		<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
			<!-- Modal Header -->
			<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Jelajahi Ayat</h3>
					<button
						onclick={closeModal}
						class="text-white hover:text-gray-200 transition-colors"
						aria-label="Tutup modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<!-- Modal Content -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
				<!-- Search Input -->
				<div class="mb-6">
					<div class="relative">
						<div class="flex items-center justify-between mb-2">
							<label for="modal-ayat-search" class="block font-semibold text-gray-700">
								Cari dalam Ayat:
							</label>
							<div class="text-sm text-gray-500 flex items-center gap-2">
								<span>Tekan</span>
								<kbd class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+F</kbd>
								<span>untuk fokus</span>
							</div>
						</div>
						<input
							id="modal-ayat-search"
							type="text"
							bind:value={searchQuery}
							placeholder="Cari teks Arab, Latin, Indonesia, atau nomor ayat..."
							class="w-full border border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
						/>
						{#if searchQuery}
							<button
								onclick={clearSearch}
								class="absolute right-3 top-[54px] text-gray-400 hover:text-gray-600"
								title="Hapus pencarian"
								aria-label="Hapus pencarian"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</button>
						{/if}
					</div>

					<!-- Advanced Filter Toggle -->
					<div class="mt-3">
						<button
							onclick={() => (showAdvancedFilter = !showAdvancedFilter)}
							class="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-2"
						>
							<svg
								class="w-4 h-4 transition-transform {showAdvancedFilter ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
							Filter Lanjutan
						</button>

						{#if showAdvancedFilter}
							<div class="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
								<div class="flex items-center gap-4">
									<label class="flex items-center gap-2">
										<input
											type="checkbox"
											bind:checked={filterByRange}
											class="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
										/>
										<span class="text-sm font-medium text-gray-700">
											Filter berdasarkan rentang ayat
										</span>
									</label>
								</div>

								{#if filterByRange}
									<div class="mt-3 flex items-center gap-4">
										<div class="flex items-center gap-2">
											<label for="modal-range-start" class="text-sm text-gray-600">
												Dari ayat:
											</label>
											<input
												id="modal-range-start"
												type="number"
												bind:value={rangeStart}
												min="1"
												max={surah?.jumlahAyat ?? 1}
												class="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
											/>
										</div>
										<div class="flex items-center gap-2">
											<label for="modal-range-end" class="text-sm text-gray-600">
												Sampai ayat:
											</label>
											<input
												id="modal-range-end"
												type="number"
												bind:value={rangeEnd}
												min={rangeStart}
												max={surah?.jumlahAyat ?? 1}
												class="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
											/>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Search Results -->
					{#if showSearchResults}
						<div class="mt-3 bg-white border border-emerald-200 rounded-lg shadow-lg max-h-96 overflow-y-auto search-results">
							<div class="p-3 bg-emerald-50 border-b border-emerald-200 sticky top-0">
								<div class="flex items-center justify-between">
									<p class="text-sm font-semibold text-emerald-800">
										Ditemukan {filteredAyats.length} ayat
										{#if filterByRange}
											<span class="text-xs font-normal">(dari ayat {rangeStart}-{rangeEnd})</span>
										{/if}
									</p>
									<div class="flex items-center gap-2">
										<button
											onclick={() => {
												if (filteredAyats.length > 0) {
													scrollToAyat(filteredAyats[0].nomorAyat);
												}
											}}
											class="text-xs text-emerald-600 hover:text-emerald-800 px-2 py-1 rounded border border-emerald-200 hover:border-emerald-300"
										>
											Pergi ke pertama
										</button>
										<button
											onclick={clearSearch}
											class="text-xs text-gray-500 hover:text-gray-700"
											aria-label="Tutup hasil pencarian"
										>
											✕
										</button>
									</div>
								</div>
							</div>
							{#each filteredAyats as ayat, index}
								<button
									onclick={() => scrollToAyat(ayat.nomorAyat)}
									class="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-emerald-50 focus:border-emerald-200 transition-colors"
								>
									<div class="flex items-center justify-between mb-2">
										<div class="flex items-center gap-2">
											<span class="text-sm font-semibold text-emerald-600">
												Ayat {ayat.nomorAyat}
											</span>
											<span class="text-xs text-gray-500">#{index + 1}</span>
										</div>
										<div class="flex items-center gap-2">
											<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
											</svg>
										</div>
									</div>
									<div class="space-y-1">
										<p class="text-right text-lg font-arabic text-gray-800 leading-relaxed" dir="rtl">
											{@html highlightText(ayat.teksArab, searchQuery)}
										</p>
										<p class="text-xs text-gray-600 italic line-clamp-1">
											{@html highlightText(ayat.teksLatin, searchQuery)}
										</p>
										<p class="text-sm text-gray-700 line-clamp-2">
											{@html highlightText(ayat.teksIndonesia, searchQuery)}
										</p>
									</div>
								</button>
							{/each}

							{#if filteredAyats.length === 10}
								<div class="p-3 text-center bg-gray-50 border-t border-gray-200">
									<p class="text-xs text-gray-500">
										Hanya 10 hasil pertama yang ditampilkan. Perbaiki pencarian untuk hasil yang lebih spesifik.
									</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
				<div class="flex justify-end gap-3">
					<button
						onclick={closeModal}
						class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Line clamp utilities */
	.line-clamp-1 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.line-clamp-2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	/* Custom scrollbar for search results */
	.search-results::-webkit-scrollbar {
		width: 6px;
	}

	.search-results::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 3px;
	}

	.search-results::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	.search-results::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
