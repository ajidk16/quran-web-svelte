<script>
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { X, Facebook, Twitter, MessageCircle, Send, Mail, Copy, Check } from '@lucide/svelte';

	/**
	 * @type {boolean}
	 */
	export let show = false;
	
	/**
	 * @type {any}
	 */
	export let ayat = null;
	
	/**
	 * @type {any}
	 */
	export let surah = null;

	const dispatch = createEventDispatcher();
	let copySuccess = false;

	function closeModal() {
		show = false;
		dispatch('close');
	}

	function getAyatText() {
		if (!ayat || !surah) return '';
		
		// Determine the base URL based on environment
		let baseUrl = '';
		if (browser) {
			baseUrl = window.location.origin;
		}
		
		const currentUrl = `${baseUrl}/quran/${surah.slug || surah.nomor}#ayat-${ayat.nomorAyat}`;
		
		return `${surah.namaLatin} - Ayat ${ayat.nomorAyat}

${ayat.teksArab}

${ayat.teksLatin}

${ayat.teksIndonesia}

${currentUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dibagikan melalui Al-Quran Digital
Semoga bermanfaat dan mendapat berkah`;
	}

	function getShareText() {
		if (!ayat || !surah) return '';
		
		// Determine the base URL based on environment
		let baseUrl = '';
		if (browser) {
			baseUrl = window.location.origin;
		}
		
		const currentUrl = `${baseUrl}/quran/${surah.slug || surah.nomor}#ayat-${ayat.nomorAyat}`;
		
		// Format dengan emoji yang lebih kompatibel untuk media sosial
		return `🕌 ${surah.namaLatin} - Ayat ${ayat.nomorAyat}

📖 ${ayat.teksArab}

🇮🇩 ${ayat.teksIndonesia}

🔗 ${currentUrl}

💚 #AlQuran #Islam #QuranDigital`;
	}

	async function copyToClipboard() {
		if (!browser) return;
		
		try {
			const text = getAyatText();
			await navigator.clipboard.writeText(text);
			copySuccess = true;
			setTimeout(() => copySuccess = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function shareToFacebook() {
		if (!browser) return;
		
		// Determine the base URL based on environment
		let baseUrl = '';
		if (browser) {
			baseUrl = window.location.origin;
		}
		
		const currentUrl = `${baseUrl}/quran/${surah.slug || surah.nomor}#ayat-${ayat.nomorAyat}`;
		
		// Facebook simple text - tanpa emoji yang bisa menyebabkan masalah
		const simpleFacebookText = `${surah.namaLatin} - Ayat ${ayat.nomorAyat}

${ayat.teksArab}

${ayat.teksIndonesia}

${currentUrl}

#AlQuran #Islam #QuranDigital`;
		
		// Facebook share - coba beberapa cara untuk memastikan text muncul
		const userChoice = confirm(`📘 Facebook akan membuka halaman share.\n\n📋 Apakah Anda ingin menyalin teks ayat terlebih dahulu?\n(Teks bisa dipaste manual di Facebook)\n\n✨ "${simpleFacebookText.substring(0, 80)}..."`);
		
		if (userChoice) {
			// Copy text first, then open Facebook
			navigator.clipboard.writeText(simpleFacebookText).then(() => {
				// Coba dengan quote parameter dulu
				const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(simpleFacebookText)}`;
				window.open(facebookUrl, '_blank', 'width=600,height=400');
				
				// Show temporary success message
				copySuccess = true;
				setTimeout(() => copySuccess = false, 3000);
			}).catch(() => {
				// If clipboard fails, just open Facebook
				const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(simpleFacebookText)}`;
				window.open(facebookUrl, '_blank', 'width=600,height=400');
			});
		} else {
			// Just open Facebook with quote parameter
			const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(simpleFacebookText)}`;
			window.open(facebookUrl, '_blank', 'width=600,height=400');
		}
	}

	function shareToTwitter() {
		if (!browser) return;
		
		const text = getShareText(); // Format dengan emoji yang kompatibel
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank', 'width=600,height=400');
	}

	function shareToWhatsApp() {
		if (!browser) return;
		
		const text = getAyatText(); // Format lengkap dengan emoji
		const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	}

	function shareToTelegram() {
		if (!browser) return;
		
		const text = getAyatText(); // Format lengkap dengan emoji
		const url = `https://t.me/share/url?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	}

	function shareViaEmail() {
		if (!browser) return;
		
		const subject = `🕌 Ayat Al-Quran: ${surah?.namaLatin} ${ayat?.nomorAyat}`;
		const body = getAyatText(); // Format lengkap dengan emoji
		const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.open(url);
	}
</script>

{#if show}
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		role="button"
		tabindex="0"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				closeModal();
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		}}
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
			<!-- Header -->
			<div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Bagikan Ayat</h3>
					<button
						onclick={closeModal}
						class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
					>
						<X size={20} />
					</button>
				</div>
				{#if surah && ayat}
					<p class="text-emerald-100 text-sm mt-2">
						{surah.namaLatin} - Ayat {ayat.nomorAyat}
					</p>
				{/if}
			</div>

			<!-- Ayat Preview -->
			{#if ayat}
				<div class="p-4 bg-gray-50 border-b">
					<div class="text-right mb-3">
						<p class="text-xl font-arabic text-gray-800 leading-relaxed" dir="rtl">
							{ayat.teksArab}
						</p>
					</div>
					<p class="text-sm text-gray-600 italic mb-2">{ayat.teksLatin}</p>
					<p class="text-gray-700">{ayat.teksIndonesia}</p>
				</div>
			{/if}

			<!-- Share Buttons -->
			<div class="p-6">
				<!-- Preview Section -->
				<div class="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
					<h4 class="text-sm font-semibold text-emerald-800 mb-2">📱 Format Berbeda per Platform:</h4>
					<div class="text-xs text-emerald-700 space-y-1">
						<p><strong>� Clean Text:</strong> WhatsApp (tanpa emoji)</p>
						<p><strong>🎯 Dengan Emoji:</strong> Telegram, Copy, Email</p>
						<p><strong>📝 Ringkas + Hashtag:</strong> Twitter</p>
						<p><strong>📘 Facebook:</strong> Copy otomatis + manual paste</p>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<button
						onclick={shareToFacebook}
						class="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
						title="📘 Share ke Facebook (auto-copy text untuk manual paste)"
					>
						<Facebook size={18} />
						<span class="font-medium">Facebook</span>
					</button>

					<button
						onclick={shareToTwitter}
						class="flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
						title="🐦 Tweet dengan emoji & hashtag"
					>
						<Twitter size={18} />
						<span class="font-medium">Twitter</span>
					</button>

					<button
						onclick={shareToWhatsApp}
						class="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
						title="💬 Share text bersih tanpa emoji ke WhatsApp"
					>
						<MessageCircle size={18} />
						<span class="font-medium">WhatsApp</span>
					</button>

					<button
						onclick={shareToTelegram}
						class="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
						title="✈️ Share lengkap ke Telegram"
					>
						<Send size={18} />
						<span class="font-medium">Telegram</span>
					</button>

					<button
						onclick={shareViaEmail}
						class="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
						title="📧 Email dengan emoji di subject"
					>
						<Mail size={18} />
						<span class="font-medium">Email</span>
					</button>

					<button
						onclick={copyToClipboard}
						class="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
						title="📋 Copy text lengkap dengan emoji"
					>
						{#if copySuccess}
							<Check size={18} />
							<span class="font-medium">Tersalin! ✨</span>
						{:else}
							<Copy size={18} />
							<span class="font-medium">Salin</span>
						{/if}
					</button>
				</div>

				<!-- Footer Message -->
				<div class="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 text-center">
					<p class="text-sm text-emerald-700">
						<span class="font-semibold">💚 Berbagi kebaikan adalah sedekah</span><br>
						<span class="text-emerald-600">🤲 Semoga bermanfaat dan mendapat berkah</span>
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
	
	.font-arabic {
		font-family: 'Amiri', serif;
	}
</style>