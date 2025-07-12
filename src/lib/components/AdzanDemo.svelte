<script lang="ts">
	import { nextAdzanInfo, adzanSettings, playAdzan, updateAdzanSettings, testAudio } from '$lib/modules/prayer-times/services/adzan';
	import { prayerScheduleData } from '$lib/modules/prayer-times/store';

	let isTestingAudio = $state(false);

	// Test functions
	async function testAdzanAudio() {
		isTestingAudio = true;
		try {
			await playAdzan('Test');
		} catch (error) {
			console.error('Test audio failed:', error);
		} finally {
			isTestingAudio = false;
		}
	}

	async function testWebAudio() {
		isTestingAudio = true;
		try {
			await testAudio();
		} catch (error) {
			console.error('Web audio test failed:', error);
		} finally {
			isTestingAudio = false;
		}
	}

	function setQuickTest() {
		// Set adzan to play in 1 minute for testing
		updateAdzanSettings({ minutesBefore: 1 });
	}
</script>

{#if $prayerScheduleData}
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
		<h3 class="font-semibold text-blue-800 mb-2">🧪 Adzan System Demo</h3>
		
		<div class="text-sm text-blue-700 space-y-2">
			<p><strong>Status:</strong> {$adzanSettings.enabled ? '✅ Aktif' : '❌ Nonaktif'}</p>
			<p><strong>Volume:</strong> {Math.round($adzanSettings.volume * 100)}%</p>
			<p><strong>Menit sebelum:</strong> {$adzanSettings.minutesBefore} menit</p>
			
			{#if $nextAdzanInfo}
				<p><strong>Adzan berikutnya:</strong> {$nextAdzanInfo.prayer} - {$nextAdzanInfo.prayerTime}</p>
				<p><strong>Dalam:</strong> {$nextAdzanInfo.minutesUntilAdzan} menit</p>
				{#if $nextAdzanInfo.shouldPlayNow}
					<p class="text-green-600"><strong>🔊 SEDANG MEMUTAR ADZAN!</strong></p>
				{/if}
			{/if}
		</div>

		<div class="flex gap-2 mt-3">
			<button 
				onclick={testAdzanAudio}
				class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
				disabled={isTestingAudio}
			>
				{#if isTestingAudio}
					🔄 Testing...
				{:else}
					🔊 Test Audio
				{/if}
			</button>
			
			<button 
				onclick={testWebAudio}
				class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
				disabled={isTestingAudio}
			>
				{#if isTestingAudio}
					🔄 Testing...
				{:else}
					🔔 Test Tone
				{/if}
			</button>
			
			<button 
				onclick={setQuickTest}
				class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
			>
				⏱️ Set 1 Menit (Test)
			</button>
		</div>
		
		<div class="text-xs text-blue-600 mt-2 bg-blue-100 p-2 rounded">
			<p><strong>💡 Tips:</strong></p>
			<p>• <strong>Test Audio</strong> - Coba file adzan.mp3 (jika tersedia) atau fallback ke test tone</p>
			<p>• <strong>Test Tone</strong> - Suara beep sederhana untuk memastikan audio berfungsi</p>
			<p>• File audio harus ada di: <code>/static/audio/adzan.mp3</code></p>
		</div>
	</div>
{/if}
