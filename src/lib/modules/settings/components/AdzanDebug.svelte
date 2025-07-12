<script lang="ts">
	import { onMount } from 'svelte';
	import { adzanInfo, checkAndPlayAdzan } from '../adzan';
	import { adzanSettings, updateAdzanSettings } from '../services';

	let currentTime = $state('');
	let debugInfo = $state<any>(null);

	onMount(() => {
		const updateTime = () => {
			const now = new Date();
			currentTime = now.toLocaleTimeString();
			debugInfo = $adzanInfo;
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	});

	function clearLastPlayed() {
		updateAdzanSettings({ lastPlayedDate: '' });
	}

	function setMinutesBefore(minutes: number) {
		updateAdzanSettings({ minutesBefore: minutes });
	}

	function forceTrigger() {
		clearLastPlayed();
		setTimeout(() => {
			console.log('🔥 Force triggering adzan check...');
			checkAndPlayAdzan();
		}, 100);
	}
</script>

<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono">
	<h3 class="font-bold mb-2">🐛 Adzan Debug Info (Settings Module)</h3>
	
	<div class="space-y-1">
		<div><strong>Current Time:</strong> {currentTime}</div>
		<div><strong>Adzan Enabled:</strong> {$adzanSettings.enabled ? '✅' : '❌'}</div>
		<div><strong>Minutes Before:</strong> {$adzanSettings.minutesBefore}</div>
		<div><strong>Volume:</strong> {Math.round($adzanSettings.volume * 100)}%</div>
		<div><strong>Notifications:</strong> {$adzanSettings.notificationEnabled ? '✅' : '❌'}</div>
		<div><strong>Last Played:</strong> {$adzanSettings.lastPlayedDate || 'None'}</div>
		<div><strong>Muted Prayers:</strong> {$adzanSettings.mutedPrayers.join(', ') || 'None'}</div>
	</div>

	{#if debugInfo}
		<div class="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
			<div><strong>Next Prayer:</strong> {debugInfo.prayer}</div>
			<div><strong>Prayer Time:</strong> {debugInfo.prayerTime}</div>
			<div><strong>Adzan Time (minutes):</strong> {debugInfo.adzanTime}</div>
			<div><strong>Minutes Until Adzan:</strong> {debugInfo.minutesUntilAdzan}</div>
			<div><strong>Should Play Now:</strong> 
				<span class="{debugInfo.shouldPlayNow ? 'text-green-600 font-bold' : 'text-gray-500'}">
					{debugInfo.shouldPlayNow ? '🕌 YES' : '⏰ NO'}
				</span>
			</div>
			{#if debugInfo.isNextDay}
				<div class="text-blue-600"><strong>Next Day:</strong> Yes (tomorrow)</div>
			{/if}
		</div>
	{:else}
		<div class="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 text-red-600">
			❌ No adzan info available
		</div>
	{/if}

	<!-- Quick Controls -->
	<div class="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
		<div class="flex gap-2 mb-2">
			<button 
				onclick={forceTrigger}
				class="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
			>
				🔥 Force Trigger
			</button>
			<button 
				onclick={clearLastPlayed}
				class="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
			>
				🗑 Clear Last Played
			</button>
		</div>
		<div class="flex gap-2">
			<button 
				onclick={() => setMinutesBefore(0)}
				class="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
			>
				0 min before
			</button>
			<button 
				onclick={() => setMinutesBefore(1)}
				class="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
			>
				1 min before
			</button>
			<button 
				onclick={() => setMinutesBefore(5)}
				class="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
			>
				5 min before
			</button>
		</div>
	</div>
</div>
