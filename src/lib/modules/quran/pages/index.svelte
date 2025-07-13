<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import { onMount } from 'svelte';
	import { fetchAllSurah } from '../api';
	import Card from '../components/card.svelte';
	import { quranStore, updateQuran } from '../store';
	import type { Surah } from '../types';
	import { goto } from '$app/navigation';
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { cn } from '$lib/utils';

	$quranStore;

	async function loadSurah() {
		updateQuran({ loading: true, error: null });
		try {
			const data = await fetchAllSurah();
			updateQuran({ surahs: data });
		} catch (e) {
			updateQuran({ error: e instanceof Error ? e.message : 'Error fetching surah data' });
		} finally {
			updateQuran({ loading: false });
		}
	}

	onMount(() => {
		loadSurah();
	});

	const onHandle = (data: Surah) => {
		updateQuran({ surah: data });
		goto(`/quran/${data.nomor}`);
	};

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

	// Reactive statement agar log muncul setiap surahs berubah
	// $: console.log('quran store:as', $quranStore.surahs);
</script>

<!-- Hero Section -->
<div class={cn('py-12 md:py-24', themeClasses.bgQuranHeader, themeClasses.textPrimary)}>
	<div class="container mx-auto px-6 text-center">
		<div class="mb-8">
			<h1 class={cn('text-4xl md:text-6xl font-bold mb-4', themeClasses.textPrimary)}>Al-Qur'an</h1>
			<p class={cn('text-xl max-w-2xl mx-auto leading-relaxed', themeClasses.textSecondary)}>
				{$t('quran.description')}
			</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
			<div class={cn(themeClasses.card, 'backdrop-blur-sm rounded-xl p-6 shadow-lg')}>
				<div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">114</div>
				<p class={themeClasses.textSecondary}>{$t('quran.surah')}</p>
			</div>
			<div class={cn(themeClasses.card, 'backdrop-blur-sm rounded-xl p-6 shadow-lg')}>
				<div class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">6,236</div>
				<p class={themeClasses.textSecondary}>{$t('quran.verse')}</p>
			</div>
			<div class={cn(themeClasses.card, 'backdrop-blur-sm rounded-xl p-6 shadow-lg')}>
				<div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">30</div>
				<p class={themeClasses.textSecondary}>Juz</p>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class={cn('container mx-auto px-6 py-12', themeClasses.bgPrimary)}>
	{#if $quranStore.loading}
		<div class="flex flex-col items-center justify-center py-20">
			<div class="relative">
				<div class={cn('w-16 h-16 border-4 rounded-full animate-spin', themeClasses.border)}></div>
				<div
					class="w-16 h-16 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
				></div>
			</div>
			<p class={cn('mt-4 text-lg', themeClasses.textSecondary)}>{$t('quran.loading')}</p>
		</div>
	{:else if $quranStore.error}
		<div
			class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md mx-auto"
		>
			<div class="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
			<h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">{$t('quran.error')}</h3>
			<p class="text-red-600 dark:text-red-300">{$quranStore.error}</p>
		</div>
	{:else}
		<!-- Search and Filter Section -->
		<div class="mb-8">
			<div class="max-w-md mx-auto">
				<input
					type="text"
					placeholder={`${$t('quran.search')} ${$t('quran.surah')}`}
					class={cn(
						'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none',
						themeClasses.input
					)}
				/>
			</div>
		</div>

		<!-- Surah List -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $quranStore.surahs as surah, index}
				<button
					onclick={() => onHandle(surah)}
					class="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
				>
					<Card
						sort={surah.nomor}
						name={surah.namaLatin}
						name_short={surah.nama}
						translation={surah.arti}
						revelation={surah.tempatTurun}
						ayat={surah.jumlahAyat}
						class={cn(
							'h-full border-2 border-transparent group-hover:border-emerald-200 dark:group-hover:border-emerald-600 group-hover:shadow-lg transition-all duration-300',
							themeClasses.card
						)}
					/>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

	:global(body) {
		font-family: 'Inter', sans-serif;
		min-height: 100vh;
		/* Removed fixed background gradient to allow theme switching */
	}

	/* Theme-aware background gradients */
	/* Theme-aware gradients for detail pages */
	:global(body.light) main {
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
	}

	:global(body.dark) main {
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
	}
</style>
