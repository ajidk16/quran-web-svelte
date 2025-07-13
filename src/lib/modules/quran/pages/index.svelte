<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchAllSurah } from '../api';
	import Card from '../components/card.svelte';
	import { quranStore, updateQuran } from '../store';
	import type { Surah } from '../types';
	import { goto } from '$app/navigation';

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

	// Reactive statement agar log muncul setiap surahs berubah
	// $: console.log('quran store:as', $quranStore.surahs);
</script>

<!-- Hero Section -->
<div class="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
	<div class="container mx-auto px-6 text-center">
		<div class="mb-8">
			<h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Al-Qur'an</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
				Bacalah dengan mudah dan khusyuk. Temukan kedamaian dalam setiap ayat yang suci.
			</p>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
			<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
				<div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">114</div>
				<p class="text-gray-600 dark:text-gray-300">Surah</p>
			</div>
			<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
				<div class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">6,236</div>
				<p class="text-gray-600 dark:text-gray-300">Ayat</p>
			</div>
			<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
				<div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">30</div>
				<p class="text-gray-600 dark:text-gray-300">Juz</p>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="container mx-auto px-6 py-12">
	{#if $quranStore.loading}
		<div class="flex flex-col items-center justify-center py-20">
			<div class="relative">
				<div class="w-16 h-16 border-4 border-emerald-200 dark:border-gray-600 rounded-full animate-spin"></div>
				<div
					class="w-16 h-16 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
				></div>
			</div>
			<p class="text-gray-600 dark:text-gray-300 mt-4 text-lg">Memuat daftar surah...</p>
		</div>
	{:else if $quranStore.error}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md mx-auto">
			<div class="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
			<h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Terjadi Kesalahan</h3>
			<p class="text-red-600 dark:text-red-300">{$quranStore.error}</p>
		</div>
	{:else}
		<!-- Search and Filter Section -->
		<div class="mb-8">
			<div class="max-w-md mx-auto">
				<input
					type="text"
					placeholder="Cari surah..."
					class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none"
				/>
			</div>
		</div>

		<!-- Surah List -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $quranStore.surahs as surah, index}
				<button
					on:click={() => onHandle(surah)}
					class="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
				>
					<Card
						sort={surah.nomor}
						name={surah.namaLatin}
						name_short={surah.nama}
						translation={surah.arti}
						revelation={surah.tempatTurun}
						ayat={surah.jumlahAyat}
						class="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-transparent group-hover:border-emerald-200 dark:group-hover:border-emerald-600 group-hover:shadow-lg transition-all duration-300"
					/>
				</button>
			{/each}
		</div>

		<!-- Load More Button -->
		<div class="text-center mt-12">
			<button
				class="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white px-8 py-3 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
			>
				Muat Lebih Banyak
			</button>
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

	:global(body) {
		font-family: 'Inter', sans-serif;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		min-height: 100vh;
	}
</style>
