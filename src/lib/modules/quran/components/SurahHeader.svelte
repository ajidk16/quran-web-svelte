<script lang="ts">
	import type { QuranDataDto } from '../types';

	export let surah: QuranDataDto | null = null;
</script>

{#if surah}
	<div class="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white py-16">
		<div class="container mx-auto px-6 text-center">
			<div class="max-w-4xl mx-auto">
				<h1 class="text-4xl md:text-5xl font-bold mb-4">{surah.nama}</h1>
				<p class="text-xl mb-2">{surah.arti}</p>
				<p class="text-emerald-100 dark:text-emerald-200 text-lg">
					{surah.namaLatin} • {surah.tempatTurun} • {surah.jumlahAyat} Ayat
				</p>

				<!-- Decorative element -->
				<div class="mt-8 flex justify-center">
					<div class="w-24 h-1 bg-white/30 dark:bg-white/40 rounded-full"></div>
				</div>
			</div>
		</div>
	</div>
{/if}
