<script lang="ts">
	import { t } from '$lib/utils/i18n';
	import { quranSettings, updateQuranSettings, resetQuranSettings } from '../services';
	import { Book, Volume2, Type, RotateCw, Star, Settings2 } from '@lucide/svelte';

	// Popular reciters list
	const reciters = [
		{ id: 'abdul-rahman-al-sudais', name: 'Abdul Rahman Al-Sudais', country: 'Saudi Arabia' },
		{ id: 'mishary-rashid-alafasy', name: 'Mishary Rashid Alafasy', country: 'Kuwait' },
		{ id: 'saad-al-ghamdi', name: 'Saad Al-Ghamdi', country: 'Saudi Arabia' },
		{ id: 'abdul-basit-abd-us-samad', name: 'Abdul Basit Abd us-Samad', country: 'Egypt' },
		{ id: 'maher-al-mueaqly', name: 'Maher Al-Mueaqly', country: 'Saudi Arabia' },
		{ id: 'ahmed-ibn-ali-al-ajamy', name: 'Ahmed ibn Ali al-Ajamy', country: 'Saudi Arabia' }
	];

	const translations = [
		{ id: 'id-indonesian', name: 'Bahasa Indonesia', author: 'Kementerian Agama RI' },
		{ id: 'en-sahih', name: 'English - Sahih International', author: 'Sahih International' },
		{ id: 'en-pickthall', name: 'English - Pickthall', author: 'Mohammed Marmaduke Pickthall' },
		{ id: 'ar-tafsir', name: 'Arabic - Tafsir', author: 'Ibn Kathir' }
	];

	const playbackSpeeds = [
		{ value: 0.5, label: '0.5x' },
		{ value: 0.75, label: '0.75x' },
		{ value: 1.0, label: '1x (Normal)' },
		{ value: 1.25, label: '1.25x' },
		{ value: 1.5, label: '1.5x' },
		{ value: 2.0, label: '2x' }
	];

	const textSizes = [
		{ value: 1, label: 'Very Small' },
		{ value: 2, label: 'Small' },
		{ value: 3, label: 'Medium' },
		{ value: 4, label: 'Large' },
		{ value: 5, label: 'Very Large' }
	];

	function toggleFavoriteReciter(reciterId: string) {
		const currentSettings = $quranSettings;
		if (!currentSettings || !currentSettings.favoriteReciters) return;

		const favorites = currentSettings.favoriteReciters;
		const isCurrentlyFavorite = favorites.includes(reciterId);

		if (isCurrentlyFavorite) {
			updateQuranSettings({
				favoriteReciters: favorites.filter((id) => id !== reciterId)
			});
		} else {
			updateQuranSettings({
				favoriteReciters: [...favorites, reciterId]
			});
		}
	}

	function handleReset() {
		if (confirm('Reset all Quran settings to default?')) {
			resetQuranSettings();
		}
	}
</script>

<div class="bg-white dark:bg-slate-800 rounded-lg shadow-md">
	<div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
		<div class="flex items-center gap-3">
			<Book size={24} />
			<div>
				<h3 class="text-lg font-semibold">{$t('setting_quran.title')}</h3>
				<p class="text-indigo-100 text-sm">{$t('setting_quran.subtitle')}</p>
			</div>
		</div>
	</div>

	<div class="p-6 space-y-8">
		<!-- Audio Settings -->
		<div class="space-y-4">
			<div class="flex items-center gap-2 mb-4">
				<Volume2 size={20} class="text-indigo-600 dark:text-indigo-400" />
				<h4 class="font-semibold text-gray-900 dark:text-slate-100">
					{$t('setting_quran.audioRecitation.title')}
				</h4>
			</div>

			<!-- Autoplay Toggle -->
			<div class="flex items-center justify-between">
				<div>
					<h5 class="font-medium text-gray-900 dark:text-slate-200">
						{$t('setting_quran.audioRecitation.autoplay.label')}
					</h5>
					<p class="text-sm text-gray-600 dark:text-slate-400">
						{$t('setting_quran.audioRecitation.autoplay.description')}
					</p>
				</div>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={$quranSettings?.autoplayRecitation || false}
						onchange={(e) => updateQuranSettings({ autoplayRecitation: e.currentTarget.checked })}
						class="sr-only peer"
					/>
					<div
						class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
					></div>
				</label>
			</div>

			<!-- Reciter Selection -->
			<div class="space-y-3">
				<h5 class="font-medium text-gray-900 dark:text-slate-200">
					{$t('setting_quran.audioRecitation.selectedReciter')}
				</h5>
				<select
					value={$quranSettings?.reciterId || 'abdul-rahman-al-sudais'}
					onchange={(e) => updateQuranSettings({ reciterId: e.currentTarget.value })}
					class="w-full bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					{#each reciters as reciter}
						<option value={reciter.id}>{reciter.name} ({reciter.country})</option>
					{/each}
				</select>
			</div>

			<!-- Favorite Reciters -->
			<div class="space-y-3">
				<h5 class="font-medium text-gray-900 dark:text-slate-200">
					{$t('setting_quran.audioRecitation.favoriteReciters')}
				</h5>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{#each reciters as reciter}
						<label
							class="flex items-center gap-2 p-2 border border-gray-200 dark:border-slate-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700"
						>
							<input
								type="checkbox"
								checked={$quranSettings?.favoriteReciters?.includes(reciter.id) || false}
								onchange={() => toggleFavoriteReciter(reciter.id)}
								class="text-indigo-600 rounded focus:ring-indigo-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500"
							/>
							<Star
								size={16}
								class={$quranSettings?.favoriteReciters?.includes(reciter.id)
									? 'text-yellow-500 fill-current'
									: 'text-gray-400 dark:text-slate-500'}
							/>
							<span class="text-sm text-gray-800 dark:text-slate-300">{reciter.name}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Playback Speed -->
			<div class="space-y-3">
				<h5 class="font-medium text-gray-900 dark:text-slate-200">
					{$t('setting_quran.audioRecitation.playbackSpeed')}
				</h5>
				<select
					value={$quranSettings?.playbackSpeed || 1.0}
					onchange={(e) =>
						updateQuranSettings({ playbackSpeed: parseFloat(e.currentTarget.value) })}
					class="w-full sm:w-auto min-w-[150px] bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					{#each playbackSpeeds as speed}
						<option value={speed.value}>{speed.label}</option>
					{/each}
				</select>
			</div>

			<!-- Repeat Mode -->
			<div class="space-y-3">
				<h5 class="font-medium text-gray-900 dark:text-slate-200">
					{$t('setting_quran.audioRecitation.repeatMode')}
				</h5>
				<select
					value={$quranSettings?.repeatMode || 'none'}
					onchange={(e) => updateQuranSettings({ repeatMode: e.currentTarget.value as any })}
					class="w-full sm:w-auto min-w-[150px] bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="none">None</option>
					<option value="verse">Verse</option>
					<option value="surah">Surah</option>
				</select>
			</div>
		</div>

		<!-- Display Settings -->
		<div class="space-y-4 pt-6 border-t border-gray-200 dark:border-slate-700">
			<div class="flex items-center gap-2 mb-4">
				<Type size={20} class="text-indigo-600 dark:text-indigo-400" />
				<h4 class="font-semibold text-gray-900 dark:text-slate-100">
					{$t('setting_quran.displayAndText.title')}
				</h4>
			</div>

			<!-- Translation Language -->
			<div class="space-y-3">
				<h5 class="font-medium text-gray-900 dark:text-slate-200">
					{$t('setting_quran.displayAndText.translationLanguage')}
				</h5>
				<select
					value={$quranSettings?.translationLanguage || 'id'}
					onchange={(e) =>
						updateQuranSettings({ translationLanguage: e.currentTarget.value as any })}
					class="w-full sm:w-auto min-w-[200px] bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="id">Bahasa Indonesia</option>
					<option value="en">English</option>
					<option value="ar">العربية</option>
				</select>
			</div>

			<!-- Default Translation -->
			<div class="space-y-3">
				<h5 class="font-medium text-gray-900 dark:text-slate-200">
					{$t('setting_quran.displayAndText.defaultTranslation')}
				</h5>
				<select
					value={$quranSettings?.defaultTranslation || 'id-indonesian'}
					onchange={(e) => updateQuranSettings({ defaultTranslation: e.currentTarget.value })}
					class="w-full bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					{#each translations as translation}
						<option value={translation.id}>{translation.name} - {translation.author}</option>
					{/each}
				</select>
			</div>

			<!-- Text Display Options -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div class="flex items-center justify-between">
					<label for="show-arabic" class="text-sm font-medium text-gray-700 dark:text-slate-300"
						>{$t('setting_quran.displayAndText.showArabicText')}</label
					>
					<input
						id="show-arabic"
						type="checkbox"
						checked={$quranSettings?.showArabicText}
						onchange={(e) => updateQuranSettings({ showArabicText: e.currentTarget.checked })}
						class="text-indigo-600 rounded focus:ring-indigo-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500"
					/>
				</div>
				<div class="flex items-center justify-between">
					<label
						for="show-translation"
						class="text-sm font-medium text-gray-700 dark:text-slate-300"
						>{$t('setting_quran.displayAndText.showTranslation')}</label
					>
					<input
						id="show-translation"
						type="checkbox"
						checked={$quranSettings?.showTranslation}
						onchange={(e) => updateQuranSettings({ showTranslation: e.currentTarget.checked })}
						class="text-indigo-600 rounded focus:ring-indigo-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500"
					/>
				</div>
				<div class="flex items-center justify-between">
					<label
						for="show-transliteration"
						class="text-sm font-medium text-gray-700 dark:text-slate-300"
						>{$t('setting_quran.displayAndText.showTransliteration')}</label
					>
					<input
						id="show-transliteration"
						type="checkbox"
						checked={$quranSettings?.showTransliteration}
						onchange={(e) => updateQuranSettings({ showTransliteration: e.currentTarget.checked })}
						class="text-indigo-600 rounded focus:ring-indigo-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500"
					/>
				</div>
			</div>

			<!-- Text Size Controls -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<div class="space-y-3">
					<h5 class="font-medium text-gray-900 dark:text-slate-200">
						{$t('setting_quran.displayAndText.arabicTextSize')}
					</h5>
					<select
						value={$quranSettings?.arabicTextSize || 3}
						onchange={(e) =>
							updateQuranSettings({ arabicTextSize: parseInt(e.currentTarget.value) })}
						class="w-full bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					>
						{#each textSizes as size}
							<option value={size.value}>{size.label}</option>
						{/each}
					</select>
				</div>
				<div class="space-y-3">
					<h5 class="font-medium text-gray-900 dark:text-slate-200">
						{$t('setting_quran.displayAndText.translationTextSize')}
					</h5>
					<select
						value={$quranSettings?.translationTextSize || 3}
						onchange={(e) =>
							updateQuranSettings({ translationTextSize: parseInt(e.currentTarget.value) })}
						class="w-full bg-white dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					>
						{#each textSizes as size}
							<option value={size.value}>{size.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div
			class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-slate-700"
		>
			<button
				onclick={handleReset}
				class="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
			>
				<RotateCw size={16} />
				{$t('setting_quran.resetButton')}
			</button>
		</div>
	</div>
</div>
