<script>
	import { prayerScheduleData, prayerNextCountdown } from '$modules/prayer-times/store';
	import { t } from '$lib/utils/i18n';
	import { Facebook, Github, Twitter } from '@lucide/svelte';

	const prayerTimes = $derived(
		$prayerScheduleData
			? [
					{ name: 'Subuh', time: $prayerScheduleData.data.jadwal.subuh },
					{ name: 'Dzuhur', time: $prayerScheduleData.data.jadwal.dzuhur },
					{ name: 'Ashar', time: $prayerScheduleData.data.jadwal.ashar },
					{ name: 'Maghrib', time: $prayerScheduleData.data.jadwal.maghrib },
					{ name: 'Isya', time: $prayerScheduleData.data.jadwal.isya }
				]
			: []
	);

	const quickLinks = [
		{ href: '/', label: $t('nav.home') },
		{ href: '/quran', label: 'Al-Quran' },
		{ href: '/prayer-times', label: $t('action.prayer_times') },
		{ href: '/bookmarks', label: $t('nav.bookmarks') },
		{ href: '/settings', label: $t('nav.settings') }
	];

	const resources = [
		{ href: '/about', label: $t('footer.about') },
		{ href: '/help', label: $t('footer.help') },
		{ href: '/privacy-policy', label: $t('footer.privacy_policy') },
		{ href: '/terms-of-service', label: $t('footer.terms_of_service') },
		{ href: '/contact', label: $t('footer.contact') }
	];

	const medsos = [
		{ href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
		{ href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
		{ href: 'https://github.com', icon: Github, label: 'GitHub' }
	];
</script>

<footer class="bg-slate-800 text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Logo and Description -->
			<div class="md:col-span-2">
				<div class="flex items-center space-x-2 mb-4">
					<div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
						<span class="text-white font-bold text-lg">ق</span>
					</div>
					<span class="font-bold text-xl text-emerald-400">QuranWeb</span>
				</div>
				<p class="text-slate-400 mb-4 max-w-md">
					{$t('footer.description')}
				</p>
				<div class="flex space-x-4">
					{#each medsos as medso}
						<a
							href={medso.href}
							target="_blank"
							rel="noopener noreferrer"
							class="text-slate-400 hover:text-emerald-400 transition-colors"
						>
							<medso.icon size={24} />
						</a>
					{/each}
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-lg font-semibold mb-4 text-emerald-400">Quick Links</h3>
				<ul class="space-y-2">
					{#each quickLinks as link}
						<li>
							<a href={link.href} class="text-slate-400 hover:text-emerald-400 transition-colors"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h3 class="text-lg font-semibold mb-4 text-emerald-400">Resources</h3>
				<ul class="space-y-2">
					{#each resources as resource}
						<li>
							<a
								href={resource.href}
								class="text-slate-400 hover:text-emerald-400 transition-colors">{resource.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Prayer Time Widget -->
		<div class="mt-12 pt-8 border-t border-slate-700">
			<div class="bg-slate-700 rounded-lg p-6">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between">
					<div class="mb-4 md:mb-0">
						<h4 class="text-lg font-semibold text-emerald-400 mb-2">{$t('footer.next_prayer')}</h4>
						{#if $prayerNextCountdown}
							<p class="text-2xl font-bold text-emerald-400">
								{$prayerNextCountdown.nextPrayer?.name || 'Loading...'}
								{#if $prayerNextCountdown.nextPrayer && 'isNextDay' in $prayerNextCountdown.nextPrayer && $prayerNextCountdown.nextPrayer.isNextDay}
									<span class="text-sm text-slate-400">({$t('footer.tomorrow')})</span>
								{/if}
							</p>
							<p class="text-slate-400 font-mono">
								{String($prayerNextCountdown.remaining.hours).padStart(2, '0')}:
								{String($prayerNextCountdown.remaining.minutes).padStart(2, '0')}:
								{String($prayerNextCountdown.remaining.seconds).padStart(2, '0')}
							</p>
						{:else}
							<p class="text-2xl font-bold text-slate-400">Loading...</p>
							<p class="text-slate-400">--:--:--</p>
						{/if}
					</div>
					<div class="flex items-center space-x-4">
						{#each prayerTimes as prayer}
							<div class="text-center">
								<p class="text-sm text-slate-400">{prayer.name}</p>
								<p class="font-semibold text-white">{prayer.time}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div
			class="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between"
		>
			<p class="text-slate-400 text-sm">
				© 2025 <span class="text-emerald-400 font-semibold">QuranWeb</span>. All rights reserved.
				Made with <span class="text-emerald-400">❤️</span> for the Muslim community.
			</p>
			<div class="mt-4 md:mt-0 flex items-center space-x-4">
				<p class="text-slate-400 text-sm flex items-center">
					<span class="mr-1">🌙</span>
					Hijri: <span class="text-emerald-400">17 Rajab 1446</span>
				</p>
				<p class="text-slate-400 text-sm flex items-center">
					<span class="mr-1">📍</span>
					<span class="text-emerald-400">Jakarta, Indonesia</span>
				</p>
			</div>
		</div>
	</div>
</footer>
