<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Bookmark, Copy, Play, Share, Pause, BookmarkCheck } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import type { QuranDataDto } from '../types';
	import ShareModal from '$lib/modules/quran/components/ShareModal.svelte';
	import { quranSettings } from '$modules/settings/services';
	import { toggleBookmark, isBookmarkedReactive } from '$lib/modules/bookmarks/store';
	import Toast from '$lib/components/shared/Toast.svelte';

	const {
		ayat,
		surah = null,
		selectedAyat = 0,
		playingAyat = null,
		audioLoading = null
	}: {
		ayat: any;
		surah?: QuranDataDto | null;
		selectedAyat?: number;
		playingAyat?: number | null;
		audioLoading?: number | null;
	} = $props();

	const dispatch = createEventDispatcher();

	let showShareModal = $state(false);
	let showCopyToast = $state(false);
	let showBookmarkToast = $state(false);
	let bookmarkToastMessage = $state('');

	// Reactive bookmark state
	const bookmarkStore = $derived(surah ? isBookmarkedReactive(surah.nomor, ayat.nomorAyat) : null);

	const isCurrentlyBookmarked = $derived(bookmarkStore ? $bookmarkStore : false);

	function playAudio() {
		dispatch('playAudio', { ayatNumber: ayat.nomorAyat, audioUrls: ayat.audio });
	}

	function copyAyat() {
		const textToCopy = [
			ayat.teksArab,
			ayat.teksLatin,
			ayat.teksIndonesia,
			`\n— QS. ${surah?.namaLatin} ${ayat.nomorAyat}`
		].join('\n\n');

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				showCopyToast = true;
			})
			.catch(() => {
				// Fallback untuk browser yang tidak support clipboard API
				const textArea = document.createElement('textarea');
				textArea.value = textToCopy;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				showCopyToast = true;
			});

		dispatch('copyAyat', { ayat });
	}

	function shareAyat() {
		showShareModal = true;
	}

	function closeShareModal() {
		showShareModal = false;
	}

	function handleBookmark() {
		if (!surah) return;
		if (!ayat || !ayat.nomorAyat) return;

		const bookmarkData = {
			surah: surah.nomor,
			surahName: surah.nama,
			surahNameLatin: surah.namaLatin,
			verse: ayat.nomorAyat,
			arabicText: ayat.teksArab,
			translationText: ayat.teksIndonesia,
			transliterationText: ayat.teksLatin
		};

		const wasAdded = toggleBookmark(bookmarkData);

		// Show toast notification
		bookmarkToastMessage = wasAdded
			? `Ayat ${ayat.nomorAyat} ditambahkan ke bookmark`
			: `Ayat ${ayat.nomorAyat} dihapus dari bookmark`;
		showBookmarkToast = true;

		// Show feedback to user
		dispatch('bookmarkToggled', {
			ayat: ayat.nomorAyat,
			added: wasAdded,
			surah: surah.namaLatin
		});
	}

	const listIcon = [
		{
			name: 'play',
			icon: Play,
			action: playAudio,
			label: 'Putar audio ayat'
		},
		{
			name: 'copy',
			icon: Copy,
			action: copyAyat,
			label: 'Salin ayat'
		},
		{
			name: 'bookmark',
			icon: Bookmark,
			action: handleBookmark,
			label: isCurrentlyBookmarked ? 'Hapus bookmark' : 'Tambah bookmark'
		},
		{
			name: 'share',
			icon: Share,
			action: shareAyat,
			label: 'Bagikan ayat'
		}
	];
</script>

<div
	id="ayat-{ayat.nomorAyat}"
	class={cn(
		'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-300 scroll-mt-8',
		playingAyat === ayat.nomorAyat
			? 'border-emerald-400 dark:border-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/50'
			: 'border-white/50 dark:border-gray-700/50',
		selectedAyat === ayat.nomorAyat
			? 'border-emerald-500 dark:border-emerald-400 shadow-emerald-300 dark:shadow-emerald-900/70'
			: ''
	)}
>
	<!-- Ayat Number Badge -->
	<div
		class="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 px-6 py-4"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
					<span class="text-white font-bold">{ayat.nomorAyat}</span>
				</div>
				<span class="text-white font-medium">Ayat {ayat.nomorAyat}</span>
			</div>
			<div class="flex space-x-2">
				{#each listIcon as icon}
					<button
						onclick={icon.action}
						disabled={icon.name === 'play' && audioLoading === ayat.nomorAyat}
						class={cn(
							'p-3 rounded-full transition-all duration-300 group transform cursor-pointer',
							icon.name === 'play' && audioLoading === ayat.nomorAyat
								? 'opacity-50 cursor-not-allowed bg-white/20'
								: icon.name === 'bookmark' && isCurrentlyBookmarked
									? 'bg-yellow-400/30 hover:bg-yellow-400/40 scale-110'
									: 'bg-white/20 hover:bg-white/30 hover:scale-105'
						)}
						aria-label={icon.label}
					>
						{#if icon.name === 'play' && audioLoading === ayat.nomorAyat}
							<div
								class="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin"
							></div>
						{:else if icon.name === 'play' && playingAyat === ayat.nomorAyat}
							<Pause size={18} class="text-white group-hover:scale-110 transition-transform" />
						{:else if icon.name === 'bookmark' && isCurrentlyBookmarked}
							<BookmarkCheck
								size={18}
								class="text-yellow-200 group-hover:scale-110 transition-transform duration-200"
							/>
						{:else}
							<!-- svelte-ignore svelte_component_deprecated -->
							<svelte:component
								this={icon.icon}
								size={18}
								class="text-white group-hover:scale-110 transition-transform"
							/>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Ayat Content -->
	<div id="ayat-content-{ayat.nomorAyat}" class="p-8">
		<!-- Arabic Text -->
		{#if $quranSettings.showArabicText}
			<div id="ayat-arabic-{ayat.nomorAyat}" class="text-right mb-8">
				<p
					class="text-3xl md:text-4xl leading-relaxed font-arabic text-gray-900 dark:text-gray-100 mb-4"
					dir="rtl"
				>
					{ayat.teksArab}
				</p>
				<div
					class="w-full h-px bg-gradient-to-r from-transparent via-emerald-200 dark:via-emerald-700 to-transparent"
				></div>
			</div>
		{/if}

		<!-- Latin Transliteration -->
		{#if $quranSettings.showTransliteration}
			<div id="ayat-latin-{ayat.nomorAyat}" class="mb-6">
				<div class="flex items-center mb-3">
					<div
						class="w-6 h-6 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mr-3"
					>
						<div class="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
					</div>
					<p
						class="text-sm text-emerald-700 dark:text-emerald-300 uppercase tracking-wide font-semibold"
					>
						Transliterasi
					</p>
				</div>
				<p
					class="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl"
				>
					{ayat.teksLatin}
				</p>
			</div>
		{/if}

		<!-- Indonesian Translation -->
		{#if $quranSettings.showTranslation}
			<div id="ayat-translation-{ayat.nomorAyat}">
				<div class="flex items-center mb-3">
					<div
						class="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mr-3"
					>
						<div class="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
					</div>
					<p class="text-sm text-teal-700 dark:text-teal-300 uppercase tracking-wide font-semibold">
						Terjemahan
					</p>
				</div>
				<p
					class="text-lg text-gray-800 dark:text-gray-200 leading-relaxed bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl"
				>
					{ayat.teksIndonesia}
				</p>
			</div>
		{/if}
	</div>
</div>

<!-- Share Modal -->
<ShareModal show={showShareModal} {ayat} {surah} on:close={closeShareModal} />

<!-- Toast Notifications -->
{#if showCopyToast}
	<Toast
		type="success"
		title="Berhasil!"
		message="Ayat berhasil disalin ke clipboard"
		bind:show={showCopyToast}
		duration={2500}
	/>
{/if}

{#if showBookmarkToast}
	<Toast
		type="success"
		title="Bookmark"
		message={bookmarkToastMessage}
		bind:show={showBookmarkToast}
		duration={2500}
	/>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

	.font-arabic {
		font-family: 'Amiri', serif;
	}
</style>
