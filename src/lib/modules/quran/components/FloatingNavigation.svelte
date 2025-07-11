<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ArrowUp, ChevronUp, ChevronDown, SlidersHorizontal, Search } from '@lucide/svelte';
	import type { QuranDataDto } from '../types';

	export let surah: QuranDataDto | null = null;
	export let selectedAyat: number = 0;

	const dispatch = createEventDispatcher();

	function scrollToTop() {
		dispatch('scrollToTop');
	}

	function scrollToPrevAyat() {
		if (selectedAyat > 1) {
			dispatch('scrollToPrevAyat');
		}
	}

	function scrollToNextAyat() {
		if (selectedAyat < (surah?.jumlahAyat ?? 0)) {
			dispatch('scrollToNextAyat');
		}
	}

	function openSearchModal() {
		dispatch('openSearchModal');
	}

	function openQuickNav() {
		dispatch('openQuickNav');
	}
</script>

{#if surah && surah.ayat && surah.ayat.length > 0}
	<div class="fixed bottom-6 right-6 flex flex-col gap-2 z-40">
		<button
			onclick={scrollToTop}
			class="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
			title="Ke atas (Ctrl+Home)"
			aria-label="Ke atas"
		>
			<ArrowUp size={20} class="text-white" />
		</button>

		{#if selectedAyat > 1}
			<button
				onclick={scrollToPrevAyat}
				class="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
				title="Ayat sebelumnya (Ctrl+↑)"
				aria-label="Ayat sebelumnya"
			>
				<ChevronUp class="w-5 h-5 text-white" />
			</button>
		{/if}

		<button
			onclick={openSearchModal}
			class="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
			title="Cari Ayat (Ctrl+F)"
			aria-label="Cari Ayat"
		>
			<Search class="w-5 h-5 text-white" />
		</button>

		<button
			onclick={openQuickNav}
			class="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
			title="Pergi ke ayat (Ctrl+G)"
			aria-label="Pergi ke ayat"
		>
			<SlidersHorizontal class="w-5 h-5 text-white" />
		</button>

		{#if selectedAyat < (surah?.jumlahAyat ?? 0)}
			<button
				onclick={scrollToNextAyat}
				class="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
				title="Ayat selanjutnya (Ctrl+↓)"
				aria-label="Ayat selanjutnya"
			>
				<ChevronDown class="w-5 h-5 text-white" />
			</button>
		{/if}
	</div>
{/if}
