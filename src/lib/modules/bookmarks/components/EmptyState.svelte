<script lang="ts">
	export let searchQuery = '';
</script>

<div class="bg-white rounded-lg shadow-md p-12 text-center">
	<div class="text-8xl mb-6">📖</div>
	
	{#if searchQuery}
		<h2 class="text-2xl font-semibold text-gray-700 mb-3">Tidak Ada Hasil</h2>
		<p class="text-gray-600 mb-8 max-w-md mx-auto">
			Tidak ditemukan bookmark yang sesuai dengan pencarian "<strong>{searchQuery}</strong>".
		</p>
		<div class="space-y-2 text-gray-500 text-sm max-w-md mx-auto">
			<p>Tips pencarian:</p>
			<ul class="list-disc list-inside space-y-1">
				<li>Coba kata kunci yang lebih umum</li>
				<li>Periksa ejaan kata kunci</li>
				<li>Cari berdasarkan nama surah atau isi ayat</li>
			</ul>
		</div>
	{:else}
		<h2 class="text-2xl font-semibold text-gray-700 mb-3">Belum Ada Bookmark</h2>
		<p class="text-gray-600 mb-8 max-w-md mx-auto">
			Anda belum menyimpan ayat apapun. Mulai membaca Al-Quran dan bookmark ayat favorit Anda.
		</p>
		
		<div class="bg-gray-50 rounded-lg p-6 max-w-lg mx-auto mb-8">
			<h3 class="text-lg font-semibold text-gray-800 mb-4">Cara Bookmark Ayat:</h3>
			<div class="space-y-3 text-left">
				<div class="flex items-start space-x-3">
					<div class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
					<p class="text-gray-700">Buka halaman surah yang ingin dibaca</p>
				</div>
				<div class="flex items-start space-x-3">
					<div class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
					<p class="text-gray-700">Klik ikon bookmark (🔖) pada ayat yang diinginkan</p>
				</div>
				<div class="flex items-start space-x-3">
					<div class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
					<p class="text-gray-700">Ayat akan tersimpan dan bisa diakses di halaman ini</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row gap-4 justify-center">
		<a
			href="/quran"
			class="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center justify-center space-x-2"
		>
			<span>📖</span>
			<span>Mulai Membaca</span>
		</a>
		
		{#if searchQuery}
			<button
				on:click={() => window.location.reload()}
				class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center space-x-2"
			>
				<span>🔄</span>
				<span>Reset Pencarian</span>
			</button>
		{/if}
	</div>
</div>
