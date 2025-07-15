<script>
	import {
		appSettings,
		userPreferences,
		updateAppSettings,
		resetSettings,
		exportSettings,
		importSettings
	} from '$lib/modules/settings/services';
	import AdzanSettings from '$lib/modules/settings/components/AdzanSettings.svelte';
	import AdzanDebug from '$lib/modules/settings/components/AdzanDebug.svelte';
	import AdzanService from '$lib/modules/settings/components/AdzanService.svelte';
	import QuranSettings from '$lib/modules/settings/components/QuranSettings.svelte';
	import { Settings, Download, Upload, RotateCcw, Globe, Palette, Book } from '@lucide/svelte';
	import { t } from '$lib/utils/i18n';

	let showDebug = $state(false);
	let exportData = $state('');
	let importData = $state('');
	let showExport = $state(false);
	let showImport = $state(false);

	function handleExport() {
		exportData = exportSettings();
		showExport = true;
	}

	function handleImport() {
		if (importData.trim()) {
			const success = importSettings(importData);
			if (success) {
				alert('✅ Settings imported successfully!');
				importData = '';
				showImport = false;
			} else {
				alert('❌ Failed to import settings. Please check the format.');
			}
		}
	}

	function handleReset() {
		if (confirm('Are you sure you want to reset all settings to default?')) {
			resetSettings();
			alert('✅ Settings reset to default!');
		}
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(exportData);
		alert('✅ Settings copied to clipboard!');
	}
</script>

<svelte:head>
	<title>Settings - Al-Quran Digital</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700"
>
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->

			<div class="flex items-center flex-row gap-3 mb-2 py-4">
				<div class="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full flex-shrink-0">
					<Settings size={32} class="text-emerald-600 dark:text-emerald-300" />
				</div>

				<div>
					<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
						{$t('settings.title')}
					</h1>
					<p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
						{$t('settings.description')}
					</p>
				</div>
			</div>

			<!-- Settings Sections -->
			<div class="space-y-6 settings-container">
				<AdzanSettings />
				<QuranSettings />

				<!-- Debug Panel -->
				{#if showDebug}
					<AdzanDebug />
				{/if}

				<!-- Settings Info -->
				<div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
					<h4 class="font-medium text-gray-900 dark:text-gray-100 mb-3">
						📊 {$t('setting_info.title')}
					</h4>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$t('setting_info.lastUpdated')}</span
								>
								<span class="font-medium text-gray-900 dark:text-gray-100"
									>{new Date($userPreferences.lastUpdated).toLocaleDateString('id-ID')}</span
								>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$t('setting_info.version')}</span>
								<span class="font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
							</div>
						</div>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$t('setting_info.storage')}</span>
								<span class="font-medium text-gray-900 dark:text-gray-100">localStorage</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$t('setting_info.dataSize')}</span>
								<span class="font-medium text-gray-900 dark:text-gray-100"
									>~{Math.round(JSON.stringify($userPreferences).length / 1024)} KB</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Background Services -->
<AdzanService />

<style>
	/* Firefox-specific fixes for header visibility */
	@-moz-document url-prefix() {
		header {
			position: relative !important;
			z-index: 100 !important;
			display: flex !important;
			flex-direction: column !important;
			visibility: visible !important;
			margin-bottom: 2rem !important;
			background: transparent !important;
		}

		header div {
			display: flex !important;
			align-items: center !important;
		}

		.settings-container > * {
			margin-top: 1.5rem !important;
		}

		.settings-container > *:first-child {
			margin-top: 0 !important;
		}
	}

	/* General cross-browser fixes */
	header {
		min-height: 100px;
		margin-bottom: 2rem;
		isolation: isolate;
	}

	.settings-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 0;
	}

	/* Ensure proper stacking context */
	.bg-white {
		position: relative;
		z-index: 1;
	}
</style>
