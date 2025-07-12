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

	let selectedAyat: number = 1;

	// Filter state for ayat search
	let searchQuery: string = '';
	let filteredAyats: any[] = [];
	let showSearchResults: boolean = false;
	let showAdvancedFilter: boolean = false;
	let filterByRange: boolean = false;
	let rangeStart: number = 1;
	let rangeEnd: number = 1;
	let showSearchModal: boolean = false;

	// Navigation state
	let showQuickNav = false;

	// Surah data
	let surah: QuranDataDto | null = null;
	let loading = false;
	let error: string | null = null;

	// Audio state management
	let currentAudio: HTMLAudioElement | null = null;
	let playingAyat: number | null = null;
	let audioLoading: number | null = null;

	const slug = page.params.slug;

	// Reactive statement to update range end when surah changes
	$: if (surah?.jumlahAyat) {
		rangeEnd = surah.jumlahAyat;
	}

	// Auto-scroll to playing ayat
	$: if (playingAyat !== null) {
		scrollToAyat(playingAyat);
	}

	// Scroll to ayat function
	function scrollToAyat(ayatNum: number) {
		if (!browser) return;
		
		const el = document.getElementById(`ayat-${ayatNum}`);
		if (el) {
			selectedAyat = ayatNum;
			el.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			});

			// Add temporary highlight effect
			el.classList.add('highlight-ayat');
			setTimeout(() => {
				el.classList.remove('highlight-ayat');
			}, 2000);
		}
	}

	// Load surah data
	async function loadSurah() {
		loading = true;
		error = null;
		try {
			const data = await fetchSurahBySlug(slug);
			surah = data.data;
			selectedAyat = 1;
			
			// Handle URL hash after surah is loaded
			if (browser) {
				// Use setTimeout to ensure DOM is updated
				setTimeout(() => {
					handleUrlHash();
				}, 200);
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error loading surah';
		} finally {
			loading = false;
		}
	}

	// Audio functions
	async function playAudio(ayatNumber: number, audioUrls: Record<string, string>) {
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
			let audioLoaded = false;

			for (const [, url] of audioSources) {
				if (audioLoaded) break;

				try {
					currentAudio = new Audio(url);

					currentAudio.addEventListener('loadstart', () => {
						audioLoading = ayatNumber;
					});

					currentAudio.addEventListener('canplay', () => {
						audioLoading = null;
						playingAyat = ayatNumber;
					});

					currentAudio.addEventListener('ended', () => {
						playingAyat = null;
						currentAudio = null;
						playNextAyat(ayatNumber);
					});

					currentAudio.addEventListener('error', () => {
						audioLoading = null;
						playingAyat = null;
						currentAudio = null;
					});

					await currentAudio.play();
					audioLoaded = true;
				} catch (err) {
					continue;
				}
			}

			if (!audioLoaded) {
				throw new Error('Tidak dapat memuat audio dari semua sumber');
			}
		} catch (err) {
			audioLoading = null;
			playingAyat = null;
		}
	}

	function playNextAyat(currentAyatNumber: number) {
		if (!surah?.ayat) return;

		const nextAyat = surah.ayat.find((ayat) => ayat.nomorAyat === currentAyatNumber + 1);

		if (nextAyat) {
			setTimeout(() => {
				playAudio(nextAyat.nomorAyat, nextAyat.audio);
			}, 1000);
		}
	}

	function stopAudio() {
		if (currentAudio) {
			currentAudio.pause();
			currentAudio = null;
		}
		playingAyat = null;
		audioLoading = null;
	}

	async function copyAyat(ayat: any) {
		if (!browser) return;
		
		try {
			// Determine the base URL based on environment
			let baseUrl;
			baseUrl = window.location.origin;

			const currentUrl = baseUrl + window.location.pathname + `#ayat-${ayat.nomorAyat}`;
			const textToCopy = `🕌 ${surah?.namaLatin} - Ayat ${ayat.nomorAyat}

📖 ${ayat.teksArab}

📝 ${ayat.teksLatin}

🇮🇩 ${ayat.teksIndonesia}

🔗 ${currentUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💚 Dibagikan melalui Al-Quran Digital
🤲 Semoga bermanfaat dan mendapat berkah`;
			await navigator.clipboard.writeText(textToCopy);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Navigation functions
	function scrollToTop() {
		if (!browser) return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function scrollToNextAyat() {
		if (selectedAyat < (surah?.jumlahAyat ?? 0)) {
			scrollToAyat(selectedAyat + 1);
		}
	}

	function scrollToPrevAyat() {
		if (selectedAyat > 1) {
			scrollToAyat(selectedAyat - 1);
		}
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
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

		if (event.key === 'Escape' && searchQuery) {
			clearSearch();
		}
	}

	// Function to clear search
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
	}

	// Function to handle URL hash fragment for auto-scroll
	function handleUrlHash() {
		if (!browser || !surah?.ayat) return;

		const hash = window.location.hash;
		if (hash.startsWith('#ayat-')) {
			const ayatNumber = parseInt(hash.replace('#ayat-', ''));
			
			// Validate ayat number
			if (ayatNumber >= 1 && ayatNumber <= surah.jumlahAyat) {
				// Small delay to ensure DOM is rendered
				setTimeout(() => {
					scrollToAyat(ayatNumber);
				}, 100);
			}
		}
	}

	// Function to handle hash change events
	function handleHashChange() {
		handleUrlHash();
	}

	// Component event handlers
	function handleScrollToAyat(event: CustomEvent) {
		scrollToAyat(event.detail.ayatNum);
	}

	function handlePlayAudio(event: CustomEvent) {
		playAudio(event.detail.ayatNumber, event.detail.audioUrls);
	}

	function handleCopyAyat(event: CustomEvent) {
		copyAyat(event.detail.ayat);
	}

	function handleOpenSearchModal() {
		showSearchModal = true;
	}

	function handleOpenQuickNav() {
		showQuickNav = true;
	}

	function handleCloseSearchModal() {
		showSearchModal = false;
	}

	function handleCloseQuickNav() {
		showQuickNav = false;
	}

	function handleClearSearch() {
		clearSearch();
	}

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
