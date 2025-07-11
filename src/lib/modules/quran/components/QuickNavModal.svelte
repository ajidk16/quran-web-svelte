<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import type { QuranDataDto } from '../types';

	export let show: boolean = false;
	export let surah: QuranDataDto | null = null;

	const dispatch = createEventDispatcher();

	function closeModal() {
		show = false;
		dispatch('close');
	}

	function quickScrollToAyat(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const target = event.target as HTMLInputElement;
			const ayatNum = parseInt(target.value);
			if (ayatNum && ayatNum > 0 && ayatNum <= (surah?.jumlahAyat ?? 0)) {
				dispatch('scrollToAyat', { ayatNum });
				closeModal();
				target.value = '';
			}
		} else if (event.key === 'Escape') {
			closeModal();
			(event.target as HTMLInputElement).value = '';
		}
	}

	// Auto-focus input when modal opens
	$: if (show && browser) {
		setTimeout(() => {
			const input = document.getElementById('quick-nav-input');
			if (input) input.focus();
		}, 100);
	}
</script>

{#if show}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		role="button"
		tabindex="0"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				closeModal();
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape' || (e.key === 'Enter' && e.target === e.currentTarget)) {
				closeModal();
			}
		}}
	>
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h3 class="text-lg font-semibold mb-4 text-gray-800">Pergi ke Ayat</h3>
			<div class="space-y-4">
				<div>
					<label for="quick-nav-input" class="block text-sm font-medium text-gray-700 mb-2">
						Nomor Ayat (1-{surah?.jumlahAyat ?? 0})
					</label>
					<input
						id="quick-nav-input"
						type="number"
						min="1"
						max={surah?.jumlahAyat ?? 0}
						placeholder="Masukkan nomor ayat..."
						onkeydown={quickScrollToAyat}
						class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
					/>
				</div>
				<div class="flex justify-between items-center">
					<div class="text-sm text-gray-500">Tekan Enter untuk pergi, Esc untuk tutup</div>
					<button
						onclick={closeModal}
						class="px-4 py-2 text-gray-600 hover:text-gray-800"
					>
						Batal
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
