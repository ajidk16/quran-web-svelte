<script lang="ts">
	import { adzanSettings, updateAdzanSettings, togglePrayerMute } from '../services/adzan';
	import { Volume2, VolumeX, Settings } from '@lucide/svelte';

	let showSettings = $state(false);
	
	const prayers = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
</script>

<div class="relative">
	<!-- Settings Toggle Button -->
	<button
		onclick={() => (showSettings = !showSettings)}
		class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
		title="Pengaturan Adzan"
	>
		<Volume2 size={16} />
		<span class="hidden sm:inline">Adzan</span>
	</button>

	<!-- Settings Panel -->
	{#if showSettings}
		<div class="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold text-gray-800">Pengaturan Adzan</h3>
				<button
					onclick={() => (showSettings = false)}
					class="text-gray-400 hover:text-gray-600"
				>
					<Settings size={16} />
				</button>
			</div>

			<!-- Enable/Disable -->
			<div class="mb-4">
				<label class="flex items-center gap-2">
					<input
						type="checkbox"
						checked={$adzanSettings.enabled}
						onchange={(e) => updateAdzanSettings({ enabled: (e.target as HTMLInputElement).checked })}
						class="rounded"
					/>
					<span class="text-sm">Aktifkan Adzan</span>
				</label>
			</div>

			{#if $adzanSettings.enabled}
				<!-- Volume Control -->
				<div class="mb-4">
					<div class="text-sm text-gray-600 mb-2">Volume: {Math.round($adzanSettings.volume * 100)}%</div>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={$adzanSettings.volume}
						oninput={(e) => updateAdzanSettings({ volume: parseFloat((e.target as HTMLInputElement).value) })}
						class="w-full"
						aria-label="Volume adzan"
					/>
				</div>

				<!-- Minutes Before -->
				<div class="mb-4">
					<div class="text-sm text-gray-600 mb-2">Putar sebelum: {$adzanSettings.minutesBefore} menit</div>
					<input
						type="range"
						min="0"
						max="10"
						step="1"
						value={$adzanSettings.minutesBefore}
						oninput={(e) => updateAdzanSettings({ minutesBefore: parseInt((e.target as HTMLInputElement).value) })}
						class="w-full"
						aria-label="Menit sebelum adzan"
					/>
				</div>

				<!-- Prayer Selection -->
				<div class="mb-4">
					<div class="text-sm text-gray-600 mb-2">Pilih Waktu Sholat:</div>
					<div class="space-y-2">
						{#each prayers as prayer}
							<label class="flex items-center gap-2">
								<input
									type="checkbox"
									checked={!$adzanSettings.mutedPrayers.includes(prayer)}
									onchange={() => togglePrayerMute(prayer)}
									class="rounded"
								/>
								<span class="text-sm">{prayer}</span>
								{#if $adzanSettings.mutedPrayers.includes(prayer)}
									<VolumeX size={12} class="text-gray-400" />
								{:else}
									<Volume2 size={12} class="text-emerald-600" />
								{/if}
							</label>
						{/each}
					</div>
				</div>

				<!-- Info -->
				<div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
					<p>💡 Adzan akan dimainkan {$adzanSettings.minutesBefore} menit sebelum waktu sholat.</p>
					<p>🔔 Pastikan notifikasi browser diizinkan untuk pemberitahuan.</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Overlay to close settings when clicking outside -->
{#if showSettings}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40"
		onclick={() => (showSettings = false)}
	></div>
{/if}
