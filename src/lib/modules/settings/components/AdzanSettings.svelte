<script lang="ts">
	import { adzanSettings, updateAdzanSettings, togglePrayerMute, setVolume } from '../services';
	import { playAdzan, testAudio } from '../adzan';
	import { Volume2, VolumeX, Clock, Settings, TestTube } from '@lucide/svelte';

	const prayers = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

	async function testAdzanSound() {
		try {
			await playAdzan('Test');
		} catch (error) {
			console.error('Test failed:', error);
		}
	}

	function clearLastPlayed() {
		updateAdzanSettings({ lastPlayedDate: '' });
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
	<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-t-lg">
		<div class="flex items-center gap-3">
			<Settings size={24} />
			<div>
				<h3 class="text-lg font-semibold">Pengaturan Adzan</h3>
				<p class="text-emerald-100 text-sm">Atur notifikasi dan suara adzan</p>
			</div>
		</div>
	</div>

	<div class="p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-medium text-gray-900 dark:text-gray-100">Aktifkan Adzan</h4>
				<p class="text-sm text-gray-600 dark:text-gray-400">Putar suara adzan otomatis</p>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					checked={$adzanSettings.enabled}
					onchange={(e) => updateAdzanSettings({ enabled: e.currentTarget.checked })}
					class="sr-only peer"
				/>
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
			</label>
		</div>

		<div class="space-y-3">
			<div class="flex items-center gap-2">
				<Volume2 size={18} class="text-gray-600 dark:text-gray-400" />
				<h4 class="font-medium text-gray-900 dark:text-gray-100">Volume</h4>
			</div>
			<div class="flex items-center gap-4">
				<VolumeX size={16} class="text-gray-400 dark:text-gray-500" />
				<input
					type="range"
					min="0"
					max="1"
					step="0.1"
					value={$adzanSettings.volume}
					oninput={(e) => setVolume(parseFloat(e.currentTarget.value))}
					class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider dark:bg-gray-700"
				/>
				<Volume2 size={16} class="text-gray-600 dark:text-gray-400" />
				<span class="text-sm text-gray-600 dark:text-gray-400 w-8">
					{Math.round($adzanSettings.volume * 100)}%
				</span>
			</div>
		</div>

		<div class="space-y-3">
			<div class="flex items-center gap-2">
				<Clock size={18} class="text-gray-600 dark:text-gray-400" />
				<h4 class="font-medium text-gray-900 dark:text-gray-100">Waktu Adzan</h4>
			</div>
			<div class="flex items-center gap-4">
				<select
					value={$adzanSettings.minutesBefore}
					onchange={(e) => updateAdzanSettings({ minutesBefore: parseInt(e.currentTarget.value) })}
					class="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
				>
					<option value={0}>Tepat waktu sholat</option>
					<option value={1}>1 menit sebelum</option>
					<option value={3}>3 menit sebelum</option>
					<option value={5}>5 menit sebelum</option>
					<option value={10}>10 menit sebelum</option>
					<option value={15}>15 menit sebelum</option>
				</select>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-medium text-gray-900 dark:text-gray-100">Notifikasi Browser</h4>
				<p class="text-sm text-gray-600 dark:text-gray-400">Tampilkan notifikasi di browser</p>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					checked={$adzanSettings.notificationEnabled}
					onchange={(e) => updateAdzanSettings({ notificationEnabled: e.currentTarget.checked })}
					class="sr-only peer"
				/>
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
			</label>
		</div>

		<div class="space-y-3">
			<h4 class="font-medium text-gray-900 dark:text-gray-100">Sholat yang Dibisukan</h4>
			<div class="grid grid-cols-2 md:grid-cols-5 gap-2">
				{#each prayers as prayer}
					<label class="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
						<input
							type="checkbox"
							checked={$adzanSettings.mutedPrayers.includes(prayer)}
							onchange={() => togglePrayerMute(prayer)}
							class="text-emerald-600 rounded focus:ring-emerald-500 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300">{prayer}</span>
					</label>
				{/each}
			</div>
		</div>

		<div class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
			<h4 class="font-medium text-gray-900 dark:text-gray-100">Test Audio</h4>
			<div class="flex flex-wrap gap-3">
				<button
					onclick={testAdzanSound}
					class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
				>
					<TestTube size={16} />
					Test Adzan
				</button>
				<button
					onclick={testAudio}
					class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Volume2 size={16} />
					Test Tone
				</button>
				<button
					onclick={clearLastPlayed}
					class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
				>
					Reset
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #059669;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #059669;
		cursor: pointer;
		border: none;
	}
</style>
