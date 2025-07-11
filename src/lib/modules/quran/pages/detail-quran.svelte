<script lang="ts">
	import { page } from '$app/state';
	import { Bookmark, Copy, Play, Share } from '@lucide/svelte';
	import { fetchSurahBySlug, fetchSurahDetail } from '../api';
	import { onMount } from 'svelte';
	import type { QuranAyatData, QuranSuratInfo, Surah } from '../types';

	let markdown: QuranSuratInfo;
	let detail: QuranAyatData[] = [];
	let loading = false;
	let error: string | null = null;

	let surah: Surah | null = null;

	const slug = page.params.slug;

	async function loadSurah() {
		loading = true;
		error = null;
		try {
			const data = await fetchSurahBySlug(slug);
			surah = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error loading surah';
			console.error('Error loading surah:', error);
		} finally {
			loading = false;
		}
	}

	async function loadSurahDetail() {
		loading = true;
		error = null;
		try {
			const akhirAyat = surah?.number_of_verses ?? '';
			const data = await fetchSurahDetail(slug, '1', akhirAyat);
			detail = data.data;
			markdown = data.info.surat;

			console.log('Surah detail loaded:', detail);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error loading surah detail';
			console.error('Error loading surah detail:', error);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await loadSurah();
		if (surah) {
			await loadSurahDetail();
		}
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
	<!-- Header Section -->
	{#if surah}
		<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
			<div class="container mx-auto px-6 text-center">
				<div class="max-w-4xl mx-auto">
					<h1 class="text-4xl md:text-5xl font-bold mb-4">{surah?.name_id}</h1>
					<p class="text-xl mb-2">{surah?.name_short}</p>
					<p class="text-emerald-100 text-lg">
						{surah?.translation_id} • {surah?.revelation_id} • {surah?.number_of_verses} Ayat
					</p>
					
					<!-- Decorative element -->
					<div class="mt-8 flex justify-center">
						<div class="w-24 h-1 bg-white/30 rounded-full"></div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="container mx-auto px-6 py-12 max-w-4xl">
		{#if loading}
			<div class="flex flex-col items-center justify-center py-20">
				<div class="relative">
					<div class="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
					<div class="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
				</div>
				<p class="text-gray-600 mt-4 text-lg">Memuat ayat-ayat surah...</p>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
				<div class="text-red-500 text-5xl mb-4">⚠️</div>
				<h3 class="text-lg font-semibold text-red-800 mb-2">Terjadi Kesalahan</h3>
				<p class="text-red-600">{error}</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each detail as ayat, index}
					<div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
						<!-- Ayat Number Badge -->
						<div class="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<span class="text-white font-bold">{ayat.ayah}</span>
									</div>
									<span class="text-white font-medium">Ayat {ayat.ayah}</span>
								</div>
								<div class="flex space-x-2">
									<button class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group">
										<Play size={18} class="text-white group-hover:scale-110 transition-transform" />
									</button>
									<button class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group">
										<Copy size={18} class="text-white group-hover:scale-110 transition-transform" />
									</button>
									<button class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group">
										<Bookmark size={18} class="text-white group-hover:scale-110 transition-transform" />
									</button>
									<button class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group">
										<Share size={18} class="text-white group-hover:scale-110 transition-transform" />
									</button>
								</div>
							</div>
						</div>

						<!-- Ayat Content -->
						<div class="p-8">
							<!-- Arabic Text -->
							<div class="text-right mb-8">
								<p class="text-3xl md:text-4xl leading-relaxed font-arabic text-gray-900 mb-4" dir="rtl">
									{ayat.arab}
								</p>
								<div class="w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
							</div>

							<!-- Latin Transliteration -->
							<div class="mb-6">
								<div class="flex items-center mb-3">
									<div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
										<div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
									</div>
									<p class="text-sm text-emerald-700 uppercase tracking-wide font-semibold">Transliterasi</p>
								</div>
								<p class="text-lg italic text-gray-700 leading-relaxed bg-emerald-50 p-4 rounded-xl">
									{ayat.latin}
								</p>
							</div>

							<!-- Indonesian Translation -->
							<div>
								<div class="flex items-center mb-3">
									<div class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3">
										<div class="w-2 h-2 bg-teal-600 rounded-full"></div>
									</div>
									<p class="text-sm text-teal-700 uppercase tracking-wide font-semibold">Terjemahan</p>
								</div>
								<p class="text-lg text-gray-800 leading-relaxed bg-teal-50 p-4 rounded-xl">
									{ayat.text}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

	.font-arabic {
		font-family: 'Amiri', serif;
	}
	
	:global(body) {
		font-family: 'Inter', sans-serif;
	}
</style>
