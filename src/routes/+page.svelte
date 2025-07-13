<script lang="ts">
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { t } from '$lib/utils/i18n';
	import { cn } from '$lib/utils';

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

	const listItems = [
		{
			icon: '📖',
			title: $t('beranda.title_1'),
			detail: $t('beranda.detail_1')
		},
		{
			icon: '🕌',
			title: $t('beranda.title_2'),
			detail: $t('beranda.detail_2')
		},
		{
			icon: '🔖',
			title: $t('beranda.title_3'),
			detail: $t('beranda.detail_3')
		}
	];
</script>

<div class={cn('min-h-screen bg-gray-50 dark:bg-gray-900')}>
	<div class={cn('container mx-auto px-4 py-8', themeClasses.textPrimary)}>
		<!-- Hero Section -->
	<section
		class="text-center py-12 bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900 text-white rounded-lg mb-12 p-2"
	>
		<h1 class="text-4xl md:text-6xl font-bold mb-4">{$t('beranda.welcome')}</h1>
		<p class="text-xl md:text-2xl mb-8 opacity-90">{$t('beranda.description')}</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center mx-4">
			<a
				href="/quran"
				class="bg-white dark:bg-gray-100 text-emerald-800 dark:text-emerald-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
			>
				{$t('action.start_reading')}
			</a>
			<a
				href="/prayer-times"
				class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-800 dark:hover:bg-gray-100 dark:hover:text-emerald-900 transition-colors"
			>
				{$t('action.prayer_times')}
			</a>
		</div>
	</section>

	<!-- Features Grid -->
	<section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
		{#each listItems as item}
			<div class="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
				<div class="text-3xl mb-4">{item.icon}</div>
				<h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
				<p class="text-gray-600 dark:text-gray-400">{item.detail}</p>
			</div>
		{/each}
	</section>

	<!-- Daily Verse -->
	<section class={cn('p-8 rounded-lg border', 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800')}>
		<h2 class="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 text-center">
			{$t('beranda.today_verse')}
		</h2>
		<div class="text-center">
			<p class={cn('text-lg mb-4 leading-relaxed text-gray-800 dark:text-gray-200')}>
				"And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will
				accomplish His purpose."
			</p>
			<p class="text-emerald-700 dark:text-emerald-300 font-semibold">
				— Surah At-Talaq, {$t('bookmarks.card.verse')} 3
			</p>
		</div>
	</section>
</div>
</div>
