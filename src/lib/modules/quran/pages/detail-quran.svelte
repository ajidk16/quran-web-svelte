<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { QuranDataDto } from '../types';
	import { fetchSurahBySlug } from '../api';

	// Import components
	import SurahHeader from '../components/SurahHeader.svelte';
	import AyatCard from '../components/AyatCard.svelte';
	import SearchModal from '../components/SearchModal.svelte';
	import QuickNavModal from '../components/QuickNavModal.svelte';
	import FloatingNavigation from '../components/FloatingNavigation.svelte';
	import LoadingSpinner from '../components/LoadingSpinner.svelte';
	import ErrorMessage from '../components/ErrorMessage.svelte';
	import { Toast } from '$lib/components/shared';

	// State variables
	let selectedAyat = 1;
	let searchQuery = '';
	let showSearchResults = false;
	let showAdvancedFilter = false;
	let filteredAyats: QuranDataDto['ayat'] = [];
	let filterByRange = false;
	let rangeStart = 1;
	let rangeEnd = 1;
	let showSearchModal = false;
	let showQuickNav = false;
	let surah: QuranDataDto | null = null;
	let loading = false;
	let error: string | null = null;
	let currentAudio: HTMLAudioElement | null = null;
	let playingAyat: number | null = null;
	let audioLoading: number | null = null;

	// Toast notification state
	let showToast = false;
	let toastMessage = '';
	let toastType: 'success' | 'error' | 'bookmark' = 'bookmark';

	const slug = page.params.slug;

	// Reactive statements
	$: if (surah?.jumlahAyat) rangeEnd = surah.jumlahAyat;
	$: if (playingAyat !== null) scrollToAyat(playingAyat);

	// Utility functions
	const scrollToAyat = (ayatNum: number) => {
		if (!browser) return;
		const el = document.getElementById(`ayat-${ayatNum}`);
		if (el) {
			selectedAyat = ayatNum;
			
			// Get header height dynamically
			const header = document.querySelector('header') || document.querySelector('.header');
			const headerHeight = header ? header.offsetHeight + 32 : 132; // +32 for mt-8
			
			const elementPosition = el.offsetTop - headerHeight;
			
			// Scroll dengan offset yang tepat agar ayat berada di bawah header dengan mt-8
			window.scrollTo({
				top: Math.max(0, elementPosition),
				behavior: 'smooth'
			});
			
			el.classList.add('highlight-ayat');
			setTimeout(() => el.classList.remove('highlight-ayat'), 2000);
		}
	};

	const stopAudio = () => {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio = null;
		}
		playingAyat = null;
		audioLoading = null;
	};

	const clearSearch = () => {
		searchQuery = '';
		filteredAyats = [];
		showSearchResults = false;
		showAdvancedFilter = false;
		filterByRange = false;
		if (surah?.jumlahAyat) {
			rangeStart = 1;
			rangeEnd = surah.jumlahAyat;
		}
	};

	const handleUrlHash = () => {
		if (!browser || !surah?.ayat) return;
		const hash = window.location.hash;
		if (hash.startsWith('#ayat-')) {
			const ayatNumber = parseInt(hash.replace('#ayat-', ''));
			if (ayatNumber >= 1 && ayatNumber <= surah.jumlahAyat) {
				setTimeout(() => scrollToAyat(ayatNumber), 100);
			}
		}
	};

	// Load surah data
	const loadSurah = async () => {
		loading = true;
		error = null;
		try {
			const data = await fetchSurahBySlug(slug);
			surah = data.data;
			selectedAyat = 1;
			if (browser) setTimeout(handleUrlHash, 200);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error loading surah';
		} finally {
			loading = false;
		}
	};

	// Audio functions
	const playAudio = async (ayatNumber: number, audioUrls: Record<string, string>) => {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio = null;
		}

		if (playingAyat === ayatNumber) {
			playingAyat = null;
			return;
		}

		try {
			audioLoading = ayatNumber;
			const audioSources = Object.entries(audioUrls);
			
			for (const [, url] of audioSources) {
				try {
					currentAudio = new Audio(url);
					
					currentAudio.addEventListener('loadstart', () => audioLoading = ayatNumber);
					currentAudio.addEventListener('canplay', () => { audioLoading = null; playingAyat = ayatNumber; });
					currentAudio.addEventListener('ended', () => { playingAyat = null; currentAudio = null; playNextAyat(ayatNumber); });
					currentAudio.addEventListener('error', () => { audioLoading = null; playingAyat = null; currentAudio = null; });

					await currentAudio.play();
					break;
				} catch (err) {
					continue;
				}
			}
		} catch (err) {
			audioLoading = null;
			playingAyat = null;
		}
	};

	const playNextAyat = (currentAyatNumber: number) => {
		if (!surah?.ayat) return;
		const nextAyat = surah.ayat.find((ayat) => ayat.nomorAyat === currentAyatNumber + 1);
		if (nextAyat) setTimeout(() => playAudio(nextAyat.nomorAyat, nextAyat.audio), 1000);
	};

	// Copy ayat function
	const copyAyat = async (ayat: any) => {
		if (!browser) return;
		try {
			const currentUrl = `${window.location.origin}${window.location.pathname}#ayat-${ayat.nomorAyat}`;
			const textToCopy = `🕌 ${surah?.namaLatin} - Ayat ${ayat.nomorAyat}\n\n📖 ${ayat.teksArab}\n\n📝 ${ayat.teksLatin}\n\n🇮🇩 ${ayat.teksIndonesia}\n\n🔗 ${currentUrl}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💚 Dibagikan melalui Al-Quran Digital\n🤲 Semoga bermanfaat dan mendapat berkah`;
			await navigator.clipboard.writeText(textToCopy);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	// Navigation functions
	const scrollToTop = () => browser && window.scrollTo({ top: 0, behavior: 'smooth' });
	const scrollToNextAyat = () => selectedAyat < (surah?.jumlahAyat ?? 0) && scrollToAyat(selectedAyat + 1);
	const scrollToPrevAyat = () => selectedAyat > 1 && scrollToAyat(selectedAyat - 1);

	// Keyboard navigation
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.metaKey) {
			if (event.key === 'g') {
				event.preventDefault();
				showQuickNav = !showQuickNav;
			} else if (event.key === 'f') {
				event.preventDefault();
				showSearchModal = true;
			}
		}

		if (!showQuickNav && !showSearchModal) {
			if (event.key === 'ArrowUp' && event.ctrlKey) {
				event.preventDefault();
				scrollToPrevAyat();
			} else if (event.key === 'ArrowDown' && event.ctrlKey) {
				event.preventDefault();
				scrollToNextAyat();
			} else if (event.key === 'Home' && event.ctrlKey) {
				event.preventDefault();
				scrollToTop();
			}
		}

		if (event.key === 'Escape' && searchQuery) clearSearch();
	};

	// Event handlers
	const handleScrollToAyat = (event: CustomEvent) => scrollToAyat(event.detail.ayatNum);
	const handlePlayAudio = (event: CustomEvent) => playAudio(event.detail.ayatNumber, event.detail.audioUrls);
	const handleCopyAyat = (event: CustomEvent) => copyAyat(event.detail.ayat);

	// Handle bookmark toggle
	const handleBookmarkToggle = (event: CustomEvent) => {
		const { ayat, added, surah: surahName } = event.detail;
		toastType = 'bookmark';
		if (added) {
			toastMessage = `Ayat ${ayat} dari Surah ${surahName} telah ditambahkan ke bookmark`;
		} else {
			toastMessage = `Ayat ${ayat} dari Surah ${surahName} telah dihapus dari bookmark`;
		}
		showToast = true;
	};

	const handleToastClose = () => {
		showToast = false;
	};
	const handleOpenSearchModal = () => showSearchModal = true;
	const handleOpenQuickNav = () => showQuickNav = true;
	const handleCloseSearchModal = () => showSearchModal = false;
	const handleCloseQuickNav = () => showQuickNav = false;
	const handleClearSearch = () => clearSearch();
	const handleHashChange = () => handleUrlHash();

	// Lifecycle
	onMount(() => {
		loadSurah();
		
		if (browser) {
			document.addEventListener('keydown', handleKeydown);
			window.addEventListener('hashchange', handleHashChange);
		}

		return () => {
			stopAudio();
			if (browser) {
				document.removeEventListener('keydown', handleKeydown);
				window.removeEventListener('hashchange', handleHashChange);
			}
		};
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
	{#if surah}
		<SurahHeader {surah} />
	{/if}

	<div class="container mx-auto px-6 py-12 max-w-4xl">
		{#if loading}
			<LoadingSpinner />
		{:else if error}
			<ErrorMessage {error} />
		{:else}
			<div class="space-y-8">
				{#each surah?.ayat ?? [] as ayat}
					<AyatCard
						{ayat}
						{surah}
						{selectedAyat}
						{playingAyat}
						{audioLoading}
						on:scrollToAyat={handleScrollToAyat}
						on:playAudio={handlePlayAudio}
						on:copyAyat={handleCopyAyat}
						on:bookmarkToggled={handleBookmarkToggle}
					/>
				{/each}
			</div>
		{/if}
	</div>
</main>

<!-- Search Modal -->
<SearchModal
	bind:show={showSearchModal}
	{surah}
	bind:searchQuery
	bind:filteredAyats
	bind:showSearchResults
	bind:showAdvancedFilter
	bind:filterByRange
	bind:rangeStart
	bind:rangeEnd
	on:close={handleCloseSearchModal}
	on:scrollToAyat={handleScrollToAyat}
	on:clearSearch={handleClearSearch}
/>

<!-- Quick Navigation Modal -->
<QuickNavModal
	bind:show={showQuickNav}
	{surah}
	on:close={handleCloseQuickNav}
	on:scrollToAyat={handleScrollToAyat}
/>

<!-- Floating Navigation -->
{#if surah}
	<FloatingNavigation
		{surah}
		{selectedAyat}
		on:scrollToPrevAyat={scrollToPrevAyat}
		on:scrollToNextAyat={scrollToNextAyat}
		on:scrollToTop={scrollToTop}
		on:openSearchModal={handleOpenSearchModal}
		on:openQuickNav={handleOpenQuickNav}
	/>
{/if}

<!-- Toast Notification -->
<Toast
	bind:show={showToast}
	type={toastType}
	title={toastMessage}
	on:close={handleToastClose}
/>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

	:global(body) {
		font-family: 'Inter', sans-serif;
	}

	:global(.highlight-ayat) {
		animation: highlightPulse 2s ease-in-out;
		border-color: rgb(34 197 94) !important;
		box-shadow: 0 0 0 4px rgb(34 197 94 / 0.2) !important;
	}

	@keyframes highlightPulse {
		0% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgb(34 197 94 / 0.4);
		}
		50% {
			transform: scale(1.02);
			box-shadow: 0 0 0 8px rgb(34 197 94 / 0.2);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgb(34 197 94 / 0);
		}
	}
</style>
