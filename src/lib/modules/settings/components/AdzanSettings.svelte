<script lang="ts">
	import { adzanSettings, updateAdzanSettings, togglePrayerMute, setVolume } from '../services';
	import { playAdzan, testAudio } from '../adzan';
	import { Volume2, VolumeX, Clock, Settings, TestTube } from '@lucide/svelte';
	import { t } from '$lib/utils/i18n';

	const prayers = [
		$t('settings.setting_adzan.mutedPrayers.subuh'),
		$t('settings.setting_adzan.mutedPrayers.dzuhur'),
		$t('settings.setting_adzan.mutedPrayers.ashar'),
		$t('settings.setting_adzan.mutedPrayers.maghrib'),
		$t('settings.setting_adzan.mutedPrayers.isya')
	];

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

	const listAudio = [
		{
			label: $t('settings.setting_adzan.testAudio.testAdzanButton'),
			action: testAdzanSound,
			icon: TestTube,
			color: 'emerald'
		},
		{
			label: $t('settings.setting_adzan.testAudio.testToneButton'),
			action: testAudio,
			icon: Volume2,
			color: 'blue'
		},
		{
			label: $t('settings.setting_adzan.testAudio.resetButton'),
			action: clearLastPlayed,
			icon: Settings,
			color: 'gray'
		}
	];
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
	<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-t-lg">
		<div class="flex items-center gap-3">
			<Settings size={24} />
			<div>
				<h3 class="text-lg font-semibold">{$t('settings.setting_adzan.title')}</h3>
				<p class="text-emerald-100 text-sm">{$t('settings.setting_adzan.subtitle')}</p>
			</div>
		</div>
	</div>

	<div class="p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-medium text-gray-900 dark:text-gray-100">
					{$t('settings.setting_adzan.enableAdzan.label')}
				</h4>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{$t('settings.setting_adzan.enableAdzan.description')}
				</p>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					checked={$adzanSettings.enabled}
					onchange={(e) => updateAdzanSettings({ enabled: e.currentTarget.checked })}
					class="sr-only peer"
				/>
				<div
					class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
				></div>
			</label>
		</div>

		<div class="space-y-3">
			<div class="flex items-center gap-2">
				<Volume2 size={18} class="text-gray-600 dark:text-gray-400" />
				<h4 class="font-medium text-gray-900 dark:text-gray-100">
					{$t('settings.setting_adzan.volume')}
				</h4>
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
				<h4 class="font-medium text-gray-900 dark:text-gray-100">
					{$t('settings.setting_adzan.adzanTime.label')}
				</h4>
			</div>
			<div class="flex items-center gap-4">
				<select
					value={$adzanSettings.minutesBefore}
					onchange={(e) => updateAdzanSettings({ minutesBefore: parseInt(e.currentTarget.value) })}
					class="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
				>
					{#each Array.from({ length: 4 }, (_, i) => i * 5) as value}
						<option {value}
							>{`${value} ${$t('settings.setting_adzan.adzanTime.option', { minutes: value })}`}</option
						>
					{/each}
				</select>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<div>
				<h4 class="font-medium text-gray-900 dark:text-gray-100">
					{$t('settings.setting_adzan.browserNotification.label')}
				</h4>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{$t('settings.setting_adzan.browserNotification.description')}
				</p>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					checked={$adzanSettings.notificationEnabled}
					onchange={(e) => updateAdzanSettings({ notificationEnabled: e.currentTarget.checked })}
					class="sr-only peer"
				/>
				<div
					class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
				></div>
			</label>
		</div>

		<div class="space-y-3">
			<h4 class="font-medium text-gray-900 dark:text-gray-100">
				{$t('settings.setting_adzan.mutedPrayers.label')}
			</h4>
			<div class="grid grid-cols-2 md:grid-cols-5 gap-2">
				{#each prayers as prayer}
					<label
						class="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
					>
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
			<h4 class="font-medium text-gray-900 dark:text-gray-100">
				{$t('settings.setting_adzan.testAudio.label')}
			</h4>
			<div class="flex flex-wrap gap-3">
				{#each listAudio as item}
					<button
						onclick={item.action}
						class="flex items-center gap-2 px-4 py-2 bg-{item.color}-600 text-white rounded-lg hover:bg-{item.color}-700 transition-colors"
					>
						<svelte:component this={item.icon} size={16} />
						{item.label}
					</button>
				{/each}
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
