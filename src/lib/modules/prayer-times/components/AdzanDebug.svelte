<script lang="ts">
	import { nextAdzanInfo, adzanSettings, playAdzan, playTestTone } from '../services/adzan';
	import { onMount } from 'svelte';

	let currentTime = $state('');
	let debugInfo = $state<any>(null);

	onMount(() => {
		const updateTime = () => {
			const now = new Date();
			currentTime = now.toLocaleTimeString();
			debugInfo = $nextAdzanInfo;
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	});

	async function testAdzan() {
		try {
			await playAdzan('Test');
		} catch (error) {
			console.error('Error testing adzan:', error);
		}
	}

	async function testTone() {
		try {
			await playTestTone();
		} catch (error) {
			console.error('Error testing tone:', error);
		}
	}

	function setMinutesBefore(minutes: number) {
		adzanSettings.update(s => ({ ...s, minutesBefore: minutes }));
	}

	function clearLastPlayed() {
		adzanSettings.update(s => ({ ...s, lastPlayedDate: '' }));
	}

	async function forceTriggerAdzan() {
		// Force trigger by setting minutesBefore to 0 and clearing last played
		clearLastPlayed();
		setMinutesBefore(0);
		
		// Import and call checkAndPlayAdzan directly
		const { checkAndPlayAdzan } = await import('../services/adzan');
		setTimeout(() => {
			console.log('🔥 Force triggering adzan check...');
			checkAndPlayAdzan();
		}, 100);
	}
</script>

<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono">
	<h3 class="font-bold mb-2">🐛 Adzan Debug Info</h3>
	
	<div class="space-y-1">
		<div><strong>Current Time:</strong> {currentTime}</div>
		<div><strong>Adzan Enabled:</strong> {$adzanSettings.enabled ? '✅' : '❌'}</div>
		<div><strong>Minutes Before:</strong> {$adzanSettings.minutesBefore}</div>
		<div><strong>Volume:</strong> {Math.round($adzanSettings.volume * 100)}%</div>
		<div><strong>Last Played:</strong> {$adzanSettings.lastPlayedDate || 'None'}</div>
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
				<div class="text-blue-600"><strong>Next Day:</strong> Yes (tomorrow's Subuh)</div>
			{/if}
		</div>
	{:else}
		<div class="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 text-red-600">
			❌ No adzan info available
		</div>
	{/if}

	<!-- Test Buttons -->
	<div class="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
		<div class="flex gap-2 mb-2">
			<button 
				onclick={testAdzan}
				class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
			>
				🕌 Test Adzan Audio
			</button>
			<button 
				onclick={testTone}
				class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
			>
				🔊 Test Tone
			</button>
			<button 
				onclick={clearLastPlayed}
				class="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
			>
				🗑 Clear Last Played
			</button>
			<button 
				onclick={forceTriggerAdzan}
				class="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
			>
				🔥 Force Trigger
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
