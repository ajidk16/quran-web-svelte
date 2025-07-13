<script lang="ts">
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { t } from '$lib/utils/i18n';
	import { cn } from '$lib/utils';

	interface Props {
		searchQuery?: string;
	}

	const { searchQuery = '' }: Props = $props();

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));
</script>

<div class={cn(
	"rounded-2xl shadow-lg p-12 text-center border-2 border-dashed backdrop-blur-sm",
	"bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50",
	"border-gray-200 dark:border-gray-700/50"
)}>
	<div class="text-8xl mb-8 animate-bounce">📖</div>
	
	{#if searchQuery}
		<h2 class={cn("text-3xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent")}>
			{$t('bookmarks.empty.search.title')}
		</h2>
		<p class={cn("mb-8 max-w-md mx-auto text-lg", themeClasses.textSecondary)}>
			{$t('bookmarks.empty.search.subtitle', { query: searchQuery })}
		</p>
		<div class={cn(
			"p-6 rounded-xl border-2 border-dashed max-w-md mx-auto",
			"bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
			"border-blue-200 dark:border-blue-700/50"
		)}>
			<p class={cn("text-sm font-semibold mb-3", themeClasses.textPrimary)}>{$t('search.tips')}</p>
			<ul class={cn("list-disc list-inside space-y-1 text-sm", themeClasses.textMuted)}>
				<li>{$t('search.tip1')}</li>
				<li>{$t('search.tip2')}</li>
				<li>{$t('search.tip3')}</li>
			</ul>
		</div>
	{:else}
		<h2 class={cn("text-3xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent")}>
			{$t('bookmarks.empty.title')}
		</h2>
		<p class={cn("mb-8 max-w-md mx-auto text-lg", themeClasses.textSecondary)}>
			{$t('bookmarks.empty.subtitle')}
		</p>
		
		<div class={cn(
			"p-8 rounded-xl border-2 border-dashed max-w-lg mx-auto mb-8",
			"bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
			"border-emerald-200 dark:border-emerald-700/50"
		)}>
			<h3 class={cn("text-xl font-bold mb-6", themeClasses.textPrimary)}>
				{$t('bookmarks.how.title')}
			</h3>
			<div class="space-y-4 text-left">
				<div class="flex items-start space-x-4">
					<div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 shadow-md">1</div>
					<p class={cn("flex-1 leading-relaxed", themeClasses.textSecondary)}>{$t('bookmarks.how.step1')}</p>
				</div>
				<div class="flex items-start space-x-4">
					<div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 shadow-md">2</div>
					<p class={themeClasses.textSecondary}>{$t('bookmarks.how.step2')}</p>
				</div>
				<div class="flex items-start space-x-3">
					<div class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
					<p class={themeClasses.textSecondary}>{$t('bookmarks.how.step3')}</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
		<a
			href="/quran"
			class={cn(
				"px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl",
				"bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
				"text-white transform hover:scale-105",
				"inline-flex items-center justify-center gap-3"
			)}
		>
			<span class="text-xl">📖</span>
			<span>{$t('action.start_reading')}</span>
		</a>
		
		{#if searchQuery}
			<button
				on:click={() => window.location.reload()}
				class={cn(
					"px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg",
					"border-2 transform hover:scale-105",
					"inline-flex items-center justify-center gap-3",
					themeClasses.border,
					themeClasses.textPrimary,
					"hover:border-emerald-300 dark:hover:border-emerald-600"
				)}
			>
				<span>🔄</span>
				<span>{$t('action.reset_search')}</span>
			</button>
		{/if}
	</div>
</div>
