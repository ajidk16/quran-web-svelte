<script>
	import { page } from '$app/stores';
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import { t } from '$lib/utils/i18n';

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	const navigation = [
		{ href: '/', label: 'nav.home', icon: '🏠' },
		{ href: '/quran', label: 'nav.quran', icon: '📖' },
		{ href: '/prayer-times', label: 'nav.prayer-times', icon: '🕌' },
		{ href: '/bookmarks', label: 'nav.bookmarks', icon: '🔖' },
		{ href: '/settings', label: 'nav.settings', icon: '⚙️' }
	];
</script>

<header class="bg-emerald-700 dark:bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo and Title -->
			<div class="flex items-center space-x-3">
				<a href="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
					<div
						class="w-8 h-8 bg-white dark:bg-gray-100 rounded-full flex items-center justify-center"
					>
						<span class="text-emerald-700 dark:text-emerald-800 font-bold text-lg">ق</span>
					</div>
					<span class="font-bold text-xl hidden sm:block">IQRO</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex space-x-8">
				{#each navigation as item}
					<a
						href={item.href}
						class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-600 dark:hover:bg-emerald-700"
						class:bg-emerald-800={$page.url.pathname === item.href}
						class:dark:bg-emerald-900={$page.url.pathname === item.href}
					>
						<span class="text-base">{item.icon}</span>
						<span>{$t(item.label)}</span>
					</a>
				{/each}
			</nav>

			<!-- Controls and Search Bar (Desktop) -->
			<div class="hidden lg:flex items-center space-x-4">
				<!-- Theme Toggle -->
				<ThemeToggle size="sm" />

				<!-- Language Toggle -->
				<LanguageToggle size="sm" />
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={toggleMobileMenu}
					class="p-2 rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
					aria-label="Toggle navigation menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-emerald-600 dark:border-emerald-700 pt-4 pb-3">
				<!-- Mobile Navigation Items -->
				<nav class="space-y-1">
					{#each navigation as item}
						<a
							href={item.href}
							onclick={() => (mobileMenuOpen = false)}
							class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-emerald-600 dark:hover:bg-emerald-700"
							class:bg-emerald-800={$page.url.pathname === item.href}
							class:dark:bg-emerald-900={$page.url.pathname === item.href}
						>
							<span class="text-lg">{item.icon}</span>
							<span>{$t(item.label)}</span>
						</a>
					{/each}
				</nav>
				<!-- Controls -->
				<div class="flex items-center justify-center space-x-4 mt-4">
					<!-- Theme Toggle -->
					<ThemeToggle size="sm" />
					<!-- Language Toggle -->
					<LanguageToggle size="sm" />
				</div>
			</div>
		{/if}
	</div>
</header>
