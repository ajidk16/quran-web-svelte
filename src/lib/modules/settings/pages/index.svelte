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
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { t } from '$lib/utils/i18n';
	import { cn } from '$lib/utils';

	let showDebug = $state(false);
	let exportData = $state('');
	let importData = $state('');
	let showExport = $state(false);
	let showImport = $state(false);

	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

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

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<header class="mb-8 relative z-10 bg-transparent">
				<div class="flex items-center gap-3 mb-2 py-4">
					<div class="p-2 bg-emerald-100 rounded-full flex-shrink-0">
						<Settings size={32} class="text-emerald-600" />
					</div>
					<div class="flex-grow">
						<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Pengaturan</h1>
						<p class="text-sm sm:text-base text-gray-600 mt-1">
							Sesuaikan pengalaman Al-Quran dan jadwal sholat Anda
						</p>
					</div>
				</div>
			</header>

			<!-- Settings Sections -->
			<div class="space-y-6 settings-container">
				<AdzanSettings />
				<QuranSettings />
				
				<!-- App Settings -->
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
					<div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
						<div class="flex items-center gap-3">
							<Palette size={24} />
							<div>
								<h3 class="text-lg font-semibold">Pengaturan Aplikasi</h3>
								<p class="text-blue-100 text-sm">Tema, bahasa, dan preferensi umum</p>
							</div>
						</div>
					</div>

					<div class="p-6 space-y-6">
						<!-- Theme Settings -->
						<div class="space-y-3">
							<h4 class="font-medium text-gray-900 flex items-center gap-2">
								<Palette size={18} />
								Tema Aplikasi
							</h4>
							<select
								class="w-full sm:w-auto min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="light">🌞 Light Mode</option>
								<option value="dark">🌙 Dark Mode</option>
								<option value="auto">🔄 Mengikuti Sistem</option>
							</select>
						</div>

						<!-- Language Settings -->
						<div class="space-y-3">
							<h4 class="font-medium text-gray-900 flex items-center gap-2">
								<Globe size={18} />
								Bahasa Interface
							</h4>
							<select
								class="w-full sm:w-auto min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="id">🇮🇩 Bahasa Indonesia</option>
								<option value="ar">🇸🇦 العربية</option>
								<option value="en">🇺🇸 English</option>
							</select>
						</div>

						<!-- Auto Location -->
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-medium text-gray-900">Deteksi Lokasi Otomatis</h4>
								<p class="text-sm text-gray-600">Gunakan lokasi perangkat untuk jadwal sholat</p>
							</div>
							<label class="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={$appSettings.autoLocation}
									onchange={(e) => updateAppSettings({ autoLocation: e.currentTarget.checked })}
									class="sr-only peer"
								/>
								<div
									class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
								></div>
							</label>
						</div>
					</div>
				</div>

				<!-- Settings Management -->
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
					<div class="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
						<div class="flex items-center gap-3">
							<Settings size={24} />
							<div>
								<h3 class="text-lg font-semibold">Kelola Pengaturan</h3>
								<p class="text-gray-100 text-sm">Backup, restore, dan reset pengaturan</p>
							</div>
						</div>
					</div>

					<div class="p-6 space-y-6">
						<!-- Export/Import -->
						<div class="space-y-4">
							<div class="flex flex-wrap gap-3">
								<button
									onclick={handleExport}
									class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
								>
									<Download size={16} />
									Export Settings
								</button>
								<button
									onclick={() => (showImport = !showImport)}
									class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									<Upload size={16} />
									Import Settings
								</button>
								<button
									onclick={handleReset}
									class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
								>
									<RotateCcw size={16} />
									Reset All
								</button>
							</div>

							<!-- Export Modal -->
							{#if showExport}
								<div class="border border-green-300 rounded-lg p-4 bg-green-50">
									<h5 class="font-medium mb-2 text-green-800">Export Data Berhasil</h5>
									<p class="text-sm text-green-700 mb-3">
										Copy data di bawah dan simpan sebagai backup.
									</p>
									<textarea
										bind:value={exportData}
										readonly
										rows="6"
										class="w-full p-3 border border-green-300 rounded-md font-mono text-sm bg-white"
									></textarea>
									<div class="mt-3 flex gap-2">
										<button
											onclick={copyToClipboard}
											class="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
										>
											📋 Copy
										</button>
										<button
											onclick={() => (showExport = false)}
											class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
										>
											Close
										</button>
									</div>
								</div>
							{/if}

							<!-- Import Modal -->
							{#if showImport}
								<div class="border border-blue-300 rounded-lg p-4 bg-blue-50">
									<h5 class="font-medium mb-2 text-blue-800">Import Settings</h5>
									<p class="text-sm text-blue-700 mb-3">
										Paste data export yang tersimpan sebelumnya.
									</p>
									<textarea
										bind:value={importData}
										placeholder="Paste settings JSON here..."
										rows="6"
										class="w-full p-3 border border-blue-300 rounded-md font-mono text-sm"
									></textarea>
									<div class="mt-3 flex gap-2">
										<button
											onclick={handleImport}
											class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
										>
											📥 Import
										</button>
										<button
											onclick={() => (showImport = false)}
											class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
										>
											Cancel
										</button>
									</div>
								</div>
							{/if}
						</div>

						<!-- Debug Toggle -->
						<div class="pt-4 border-t border-gray-200">
							<button
								onclick={() => (showDebug = !showDebug)}
								class="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
							>
								<Book size={16} />
								{showDebug ? 'Hide' : 'Show'} Debug Info
							</button>
						</div>
					</div>
				</div>

				<!-- Debug Panel -->
				{#if showDebug}
					<AdzanDebug />
				{/if}

				<!-- Settings Info -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<h4 class="font-medium text-gray-900 mb-3">📊 Informasi Pengaturan</h4>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600">Terakhir Diupdate:</span>
								<span class="font-medium"
									>{new Date($userPreferences.lastUpdated).toLocaleDateString('id-ID')}</span
								>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Version:</span>
								<span class="font-medium">1.0.0</span>
							</div>
						</div>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600">Storage:</span>
								<span class="font-medium">localStorage</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Data Size:</span>
								<span class="font-medium"
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

<!-- Background Services -->
<AdzanService />
