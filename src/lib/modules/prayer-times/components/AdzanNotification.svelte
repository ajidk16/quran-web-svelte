<script lang="ts">
	import { prayerScheduleData, prayerNextCountdown } from '$modules/prayer-times/store';
	import { nextAdzanInfo, adzanSettings, stopAdzan } from '../services/adzan';
	import { X, Volume2, VolumeX } from '@lucide/svelte';

	$: showInfo = $nextAdzanInfo && $adzanSettings.enabled;
</script>

{#if showInfo && $nextAdzanInfo}
	<div class="fixed top-4 right-4 bg-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
		<div class="flex items-start justify-between gap-2">
			<div class="flex-1">
				<div class="flex items-center gap-2 mb-1">
					<span class="text-sm font-medium">🕌 Adzan {$nextAdzanInfo.prayer}</span>
				</div>

				{#if $nextAdzanInfo.shouldPlayNow}
					<p class="text-xs text-emerald-100">Sedang diputar...</p>
				{:else}
					<p class="text-xs text-emerald-100 font-mono">
						{String($prayerNextCountdown?.remaining?.hours).padStart(2, '0')}:
						{String($prayerNextCountdown?.remaining?.minutes).padStart(2, '0')}:
						{String($prayerNextCountdown?.remaining?.seconds).padStart(2, '0')}
					</p>
				{/if}

				<p class="text-xs text-emerald-200">
					Jam {$nextAdzanInfo.prayerTime}
					{#if $nextAdzanInfo.isNextDay}(Besok){/if}
				</p>
			</div>

			<div class="flex items-center gap-1">
				{#if $nextAdzanInfo.shouldPlayNow}
					<button onclick={stopAdzan} class="p-1 hover:bg-emerald-700 rounded" title="Stop adzan">
						<VolumeX size={14} />
					</button>
				{:else}
					<Volume2 size={14} class="text-emerald-200" />
				{/if}

				<button
					onclick={() => adzanSettings.update((s) => ({ ...s, enabled: false }))}
					class="p-1 hover:bg-emerald-700 rounded"
					title="Nonaktifkan adzan"
				>
					<X size={14} />
				</button>
			</div>
		</div>
	</div>
{/if}
