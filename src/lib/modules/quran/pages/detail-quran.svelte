<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { QuranDataDto } from '../types';
	import { fetchSurahBySlug } from '../api';
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { cn } from '$lib/utils';

	// Import components

	import AyatCard from '../components/AyatCard.svelte';
	import SearchModal from '../components/SearchModal.svelte';
	import QuickNavModal from '../components/QuickNavModal.svelte';
	import FloatingNavigation from '../components/FloatingNavigation.svelte';
	import LoadingSpinner from '../components/LoadingSpinner.svelte';
	import ErrorMessage from '../components/ErrorMessage.svelte';
	import { Toast } from '$lib/components/shared';

	// State variables using Svelte 5 runes
	let selectedAyat = $state(1);
	let searchQuery = $state('');
	let showSearchResults = $state(false);
	let showAdvancedFilter = $state(false);
	let filteredAyats: QuranDataDto['ayat'] = $state([]);
	let filterByRange = $state(false);
	let rangeStart = $state(1);
	let rangeEnd = $state(1);
	let showSearchModal = $state(false);
	let showQuickNav = $state(false);
	let surah: QuranDataDto | null = $state(null);
	let loading = $state(false);
	let error: string | null = $state(null);
	let currentAudio: HTMLAudioElement | null = null;
	let playingAyat: number | null = $state(null);
	let audioLoading: number | null = $state(null);

	// Toast notification state
	let showToast = $state(false);
	let toastMessage = $state('');
	let toastType: 'success' | 'error' | 'bookmark' = $state('bookmark');

	const slug = page.params.slug;

	// Theme classes
	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

	// Reactive effects
	$effect(() => {
		if (surah?.jumlahAyat) {
			rangeEnd = surah.jumlahAyat;
		}
	});

	$effect(() => {
		if (playingAyat !== null) {
			scrollToAyat(playingAyat);
		}
	});

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

					currentAudio.addEventListener('loadstart', () => (audioLoading = ayatNumber));
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
	const scrollToNextAyat = () =>
		selectedAyat < (surah?.jumlahAyat ?? 0) && scrollToAyat(selectedAyat + 1);
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
	const handlePlayAudio = (event: CustomEvent) =>
		playAudio(event.detail.ayatNumber, event.detail.audioUrls);
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
	const handleOpenSearchModal = () => (showSearchModal = true);
	const handleOpenQuickNav = () => (showQuickNav = true);
	const handleCloseSearchModal = () => (showSearchModal = false);
	const handleCloseQuickNav = () => (showQuickNav = false);
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

<main class={cn('min-h-screen', themeClasses.bgSecondary)}>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
		{#if loading}
			<div class="flex justify-center items-center py-20">
				<LoadingSpinner />
			</div>
		{:else if error}
			<div class="max-w-2xl mx-auto">
				<ErrorMessage {error} />
			</div>
		{:else if surah}
			<!-- Surah Info Card -->
			<div class={cn('rounded-2xl shadow-lg p-6 mb-8', themeClasses.card)}>
				<div class="text-center space-y-4">
					<div class={cn('inline-flex items-center justify-center w-16 h-16 text-5xl mb-4')}>
						{surah.nama}
					</div>
					<h1 class={cn('text-2xl sm:text-3xl font-bold', themeClasses.textPrimary)}>
						{surah.namaLatin}
					</h1>
					<p class={themeClasses.textSecondary}>
						{surah.tempatTurun} • {surah.jumlahAyat} Ayat
					</p>
					{#if surah.arti}
						<p class={cn('text-sm italic', themeClasses.textMuted)}>
							"{surah.arti}"
						</p>
					{/if}
				</div>
			</div>

			<!-- Ayat Cards -->
			<div class="space-y-6">
				{#each surah.ayat as ayat}
					<div class="group">
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
					</div>
				{/each}
			</div>

			<!-- Bottom Spacing -->
			<div class="h-20"></div>
		{/if}
	</div>

	<!-- Background Pattern -->
	<div class={cn('fixed inset-0 -z-10', $currentTheme === 'dark' ? 'opacity-10' : 'opacity-5')}>
		<svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern
					id="islamic-pattern"
					x="0"
					y="0"
					width="20"
					height="20"
					patternUnits="userSpaceOnUse"
				>
					<path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" class="text-emerald-500" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#islamic-pattern)" />
		</svg>
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
<Toast bind:show={showToast} type={toastType} title={toastMessage} on:close={handleToastClose} />

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
