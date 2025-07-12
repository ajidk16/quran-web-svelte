<script lang="ts">
	import { onMount } from 'svelte';
	import {
		prayerTimesStore,
		prayerSelectedCity,
		prayerScheduleData,
		prayerCurrentInfo,
		prayerIsLoading,
		prayerError,
		prayerSearchResults
	} from '../store';
	import type { SelectedCity } from '../utils/location';
	import CitySearchModal from '../components/CitySearchModal.svelte';
	import PrayerCard from '../components/PrayerCard.svelte';
	import AdzanSettings from '../components/AdzanSettings.svelte';
	import AdzanDemo from '$lib/components/AdzanDemo.svelte';
	import { MapPin, RefreshCw, Clock, Search, Navigation } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let searchKeyword = $state('');
	let showCitySearch = $state(false);
	let locationMessage = $state('');
	let locationStatus: 'success' | 'error' | '' = $state('');
	let showLocationMessage = $state(false);
	let isGettingLocation = $state(false);

	onMount(() => prayerTimesStore.initialize());

	async function selectCity(city: SelectedCity) {
		await prayerTimesStore.setCity(city);
		showCitySearch = false;
		searchKeyword = '';
	}

	function showMessage(message: string, status: 'success' | 'error' | '' = '', timeout = 5000) {
		locationMessage = message;
		locationStatus = status;
		showLocationMessage = true;
		setTimeout(() => (showLocationMessage = false), timeout);
	}

	async function getCurrentLocation() {
		isGettingLocation = true;
		showMessage('🔍 Mencari lokasi Anda...');

		try {
			const result = await prayerTimesStore.getUserLocationAndSetPrayer();
			if (result.location.city) {
				showMessage(`✅ Lokasi ditemukan: ${result.location.city}`, 'success');
			} else {
				showMessage('❌ Gagal mendapatkan lokasi.', 'error');
			}
		} catch {
			showMessage('❌ Terjadi kesalahan saat mencari lokasi.', 'error');
		}
		isGettingLocation = false;
	}

	const prayerTimes = $derived(
		$prayerScheduleData
			? [
					{ name: 'Subuh', time: $prayerScheduleData.data.jadwal.subuh },
					{ name: 'Dzuhur', time: $prayerScheduleData.data.jadwal.dzuhur },
					{ name: 'Ashar', time: $prayerScheduleData.data.jadwal.ashar },
					{ name: 'Maghrib', time: $prayerScheduleData.data.jadwal.maghrib },
					{ name: 'Isya', time: $prayerScheduleData.data.jadwal.isya }
				]
			: []
	);

	const additionalTimes = $derived(
		$prayerScheduleData
			? [
					{ name: 'Imsak', time: $prayerScheduleData.data.jadwal.imsak },
					{ name: 'Terbit', time: $prayerScheduleData.data.jadwal.terbit },
					{ name: 'Dhuha', time: $prayerScheduleData.data.jadwal.dhuha }
				].filter((t) => t.time)
			: []
	);

	function getPrayerStyle(name: string) {
		if (!$prayerCurrentInfo) return 'bg-gray-50';
		const prayer = name.toLowerCase();
		const current = $prayerCurrentInfo.current?.name.toLowerCase();
		const next = $prayerCurrentInfo.next?.name.toLowerCase();

		if (prayer === current) return 'bg-emerald-100 border-2 border-emerald-300';
		if (prayer === next) return 'bg-blue-100 border-2 border-blue-300';
		return 'bg-gray-50';
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-3xl font-bold text-gray-800">🕌 Jadwal Sholat</h1>
			<div class="flex items-center gap-3">
				<!-- Adzan Settings -->
				<AdzanSettings />

				<!-- Refresh Button -->
				{#if $prayerSelectedCity}
					<button
						onclick={() =>
							$prayerSelectedCity && prayerTimesStore.fetchPrayerTimes($prayerSelectedCity.id)}
						class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
						disabled={$prayerIsLoading}
					>
						<RefreshCw size={16} class={$prayerIsLoading ? 'animate-spin' : ''} />
						<span class="hidden sm:inline">Refresh</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Adzan Demo (for testing) -->
		<!-- <AdzanDemo /> -->

		<div class="bg-white rounded-lg shadow-md overflow-hidden">
			<!-- Location Header -->
			<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
				{#if $prayerSelectedCity}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<MapPin size={24} />
							<div>
								<h2 class="text-xl font-semibold">{$prayerSelectedCity.lokasi}</h2>
								{#if $prayerScheduleData}
									<p class="text-emerald-100 text-sm">
										📅 {$prayerScheduleData.data.jadwal.tanggal}
									</p>
								{/if}
							</div>
						</div>
						<button
							onclick={() => (showCitySearch = true)}
							class="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
						>
							<Search size={16} />
							<span class="hidden sm:inline">Ubah Kota</span>
						</button>
					</div>
				{:else}
					<div class="text-center">
						<h2 class="text-2xl font-semibold mb-2">Pilih Lokasi Anda</h2>
						<p class="text-emerald-100 mb-4">
							Dapatkan jadwal sholat yang akurat untuk wilayah Anda
						</p>
						<div class="flex gap-3 justify-center">
							<button
								onclick={() => (showCitySearch = true)}
								class="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-gray-100"
							>
								<Search size={16} />
								Cari Kota
							</button>
							<button
								onclick={getCurrentLocation}
								class="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
								disabled={$prayerIsLoading || isGettingLocation}
							>
								{#if isGettingLocation}
									<div
										class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
									></div>
								{:else}
									<Navigation size={16} />
								{/if}
								{isGettingLocation ? 'Mencari...' : 'Lokasi Saya'}
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Current Prayer Info -->
			{#if $prayerCurrentInfo}
				<div class="bg-emerald-50 border-b border-emerald-200 p-4">
					<div class="flex items-center justify-center gap-4 text-center">
						{#if $prayerCurrentInfo.current}
							<div class="flex items-center gap-2">
								<Clock size={18} class="text-emerald-600" />
								<span class="text-sm font-medium text-emerald-800"
									>Waktu: {$prayerCurrentInfo.current.name}</span
								>
							</div>
						{/if}
						{#if $prayerCurrentInfo.next}
							<div class="flex items-center gap-2">
								⏰ <span class="text-sm text-emerald-600">
									Selanjutnya: {$prayerCurrentInfo.next.name} - {$prayerCurrentInfo.next.time}
									{#if 'isNextDay' in $prayerCurrentInfo.next && $prayerCurrentInfo.next.isNextDay}
										<span class="text-xs">(Besok)</span>
									{/if}
								</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Messages & States -->
			{#if showLocationMessage}
				<div class="border-b border-gray-200 p-4">
					<div
						class={cn(
							'rounded-lg p-3 text-center text-sm',
							locationStatus === 'success' && 'bg-green-50 border-green-200 text-green-700',
							locationStatus === 'error' && 'bg-red-50 border-red-200 text-red-700',
							!locationStatus && 'bg-blue-50 border-blue-200 text-blue-700'
						)}
					>
						{locationMessage}
					</div>
				</div>
			{/if}

			{#if $prayerIsLoading}
				<div class="text-center py-12">
					<div
						class="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"
					></div>
					<p class="text-gray-600">Memuat jadwal sholat...</p>
				</div>
			{:else if $prayerError}
				<div class="m-6 bg-red-50 border border-red-200 rounded-lg p-4">
					<div class="flex items-center gap-2 text-red-600 mb-2">
						❌ <span class="font-medium">Error</span>
					</div>
					<p class="text-sm text-red-700 mb-3">{$prayerError}</p>
					<button
						onclick={() =>
							$prayerSelectedCity && prayerTimesStore.fetchPrayerTimes($prayerSelectedCity.id)}
						class="text-sm text-red-700 hover:text-red-900 underline">Coba Lagi</button
					>
				</div>
			{:else if $prayerScheduleData}
				<!-- Prayer Times -->
				<div class="p-6">
					<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
						{#each prayerTimes as prayer}
							<PrayerCard
								name={prayer.name}
								time={prayer.time}
								isCurrent={$prayerCurrentInfo?.current?.name.toLowerCase() ===
									prayer.name.toLowerCase()}
								isNext={$prayerCurrentInfo?.next?.name.toLowerCase() === prayer.name.toLowerCase()}
								style={getPrayerStyle(prayer.name)}
							/>
						{/each}
					</div>

					<!-- Additional Times -->
					{#if additionalTimes.length > 0}
						<div class="mt-6 pt-6 border-t border-gray-200">
							<h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">Waktu Tambahan</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								{#each additionalTimes as time}
									<div class="text-center p-3 bg-gray-50 rounded-lg">
										<h4 class="font-medium text-gray-600 mb-1">{time.name}</h4>
										<p class="text-lg font-semibold text-gray-700">{time.time}</p>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Empty State -->
				<div class="text-center py-12">
					<div class="text-6xl mb-4">🕌</div>
					<h2 class="text-xl font-semibold text-gray-700 mb-2">Selamat Datang</h2>
					<p class="text-gray-600 mb-6">
						Pilih lokasi Anda untuk melihat jadwal sholat yang akurat
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<CitySearchModal
	bind:show={showCitySearch}
	bind:searchKeyword
	searchResults={$prayerSearchResults}
	isLoading={$prayerIsLoading}
	{isGettingLocation}
	onClose={() => (showCitySearch = false)}
	onSearch={(keyword) => keyword.trim() && prayerTimesStore.searchCities(keyword)}
	onSelectCity={selectCity}
	onGetLocation={getCurrentLocation}
/>
