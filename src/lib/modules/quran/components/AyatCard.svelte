<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Bookmark, Copy, Play, Share, Pause } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import type { QuranDataDto } from '../types';
	import ShareModal from '$lib/modules/quran/components/ShareModal.svelte';
	import { quranSettings } from '$modules/settings/services';

	export let ayat: any;
	export let surah: QuranDataDto | null = null;
	export let selectedAyat: number = 0;
	export let playingAyat: number | null = null;
	export let audioLoading: number | null = null;

	const dispatch = createEventDispatcher();

	let showShareModal = false;

	function playAudio() {
		dispatch('playAudio', { ayatNumber: ayat.nomorAyat, audioUrls: ayat.audio });
	}

	function copyAyat() {
		dispatch('copyAyat', { ayat });
	}

	function shareAyat() {
		showShareModal = true;
	}

	function closeShareModal() {
		showShareModal = false;
	}
</script>

<div
	id="ayat-{ayat.nomorAyat}"
	class={cn(
		'bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-300 scroll-mt-8',
		playingAyat === ayat.nomorAyat ? 'border-emerald-400 shadow-emerald-200' : 'border-white/50',
		selectedAyat === ayat.nomorAyat ? 'border-emerald-500 shadow-emerald-300' : ''
	)}
>
	<!-- Ayat Number Badge -->
	<div class="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
					<span class="text-white font-bold">{ayat.nomorAyat}</span>
				</div>
				<span class="text-white font-medium">Ayat {ayat.nomorAyat}</span>
			</div>
			<div class="flex space-x-2">
				<button
					onclick={playAudio}
					disabled={audioLoading === ayat.nomorAyat}
					class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Putar audio ayat {ayat.nomorAyat}"
				>
					{#if audioLoading === ayat.nomorAyat}
						<div
							class="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin"
						></div>
					{:else if playingAyat === ayat.nomorAyat}
						<Pause size={18} class="text-white group-hover:scale-110 transition-transform" />
					{:else}
						<Play size={18} class="text-white group-hover:scale-110 transition-transform" />
					{/if}
				</button>
				<button
					onclick={copyAyat}
					class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group"
					aria-label="Salin ayat {ayat.nomorAyat}"
				>
					<Copy size={18} class="text-white group-hover:scale-110 transition-transform" />
				</button>
				<button
					class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group"
					aria-label="Bookmark ayat {ayat.nomorAyat}"
				>
					<Bookmark size={18} class="text-white group-hover:scale-110 transition-transform" />
				</button>
				<button
					onclick={shareAyat}
					class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group"
					aria-label="Bagikan ayat {ayat.nomorAyat}"
				>
					<Share size={18} class="text-white group-hover:scale-110 transition-transform" />
				</button>
			</div>
		</div>
	</div>

	<!-- Ayat Content -->
	<div id="ayat-content-{ayat.nomorAyat}" class="p-8">
		<!-- Arabic Text -->
		{#if $quranSettings.showArabicText}
			<div id="ayat-arabic-{ayat.nomorAyat}" class="text-right mb-8">
				<p class="text-3xl md:text-4xl leading-relaxed font-arabic text-gray-900 mb-4" dir="rtl">
					{ayat.teksArab}
				</p>
				<div
					class="w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"
				></div>
			</div>
		{/if}

		<!-- Latin Transliteration -->
		{#if $quranSettings.showTransliteration}
			<div id="ayat-latin-{ayat.nomorAyat}" class="mb-6">
				<div class="flex items-center mb-3">
					<div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
						<div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
					</div>
					<p class="text-sm text-emerald-700 uppercase tracking-wide font-semibold">
						Transliterasi
					</p>
				</div>
				<p class="text-lg italic text-gray-700 leading-relaxed bg-emerald-50 p-4 rounded-xl">
					{ayat.teksLatin}
				</p>
			</div>
		{/if}

		<!-- Indonesian Translation -->
		{#if $quranSettings.showTranslation}
			<div id="ayat-translation-{ayat.nomorAyat}">
				<div class="flex items-center mb-3">
					<div class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3">
						<div class="w-2 h-2 bg-teal-600 rounded-full"></div>
					</div>
					<p class="text-sm text-teal-700 uppercase tracking-wide font-semibold">Terjemahan</p>
				</div>
				<p class="text-lg text-gray-800 leading-relaxed bg-teal-50 p-4 rounded-xl">
					{ayat.teksIndonesia}
				</p>
			</div>
		{/if}
	</div>
</div>

<!-- Share Modal -->
<ShareModal show={showShareModal} {ayat} {surah} on:close={closeShareModal} />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

	.font-arabic {
		font-family: 'Amiri', serif;
	}
</style>
