<script>
	import { page } from '$app/stores';
	
	let mobileMenuOpen = $state(false);
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo and Title -->
			<div class="flex items-center space-x-3">
				<a href="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
					<div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
						<span class="text-emerald-700 font-bold text-lg">ق</span>
					</div>
					<span class="font-bold text-xl hidden sm:block">QuranWeb</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex space-x-8">
				<a
					href="/"
					class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-600"
					class:bg-emerald-800={$page.url.pathname === '/'}
				>
					<span class="text-base">🏠</span>
					<span>Home</span>
				</a>
				<a
					href="/quran"
					class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-600"
					class:bg-emerald-800={$page.url.pathname === '/quran'}
				>
					<span class="text-base">📖</span>
					<span>Al-Quran</span>
				</a>
				<a
					href="/prayer-times"
					class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-600"
					class:bg-emerald-800={$page.url.pathname === '/prayer-times'}
				>
					<span class="text-base">🕌</span>
					<span>Prayer Times</span>
				</a>
				<a
					href="/bookmarks"
					class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-600"
					class:bg-emerald-800={$page.url.pathname === '/bookmarks'}
				>
					<span class="text-base">🔖</span>
					<span>Bookmarks</span>
				</a>
				<a
					href="/settings"
					class="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-600"
					class:bg-emerald-800={$page.url.pathname === '/settings'}
				>
					<span class="text-base">⚙️</span>
					<span>Settings</span>
				</a>
			</nav>

			<!-- Search Bar (Desktop) -->
			<div class="hidden lg:flex items-center space-x-4">
				<div class="relative">
					<input
						type="text"
						placeholder="Search Quran..."
						class="bg-emerald-600 text-white placeholder-emerald-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-emerald-500 w-64"
					/>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
						<span class="text-emerald-200">🔍</span>
					</div>
				</div>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={toggleMobileMenu}
					class="p-2 rounded-md hover:bg-emerald-600 transition-colors"
					aria-label="Toggle navigation menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-emerald-600 pt-4 pb-3">
				<!-- Mobile Search -->
				<div class="px-3 pb-3">
					<div class="relative">
						<input
							type="text"
							placeholder="Search Quran..."
							class="w-full bg-emerald-600 text-white placeholder-emerald-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-emerald-500"
						/>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
							<span class="text-emerald-200">🔍</span>
						</div>
					</div>
				</div>
				
				<!-- Mobile Navigation Items -->
				<nav class="space-y-1">
					<a
						href="/"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-emerald-600"
						class:bg-emerald-800={$page.url.pathname === '/'}
					>
						<span class="text-lg">🏠</span>
						<span>Home</span>
					</a>
					<a
						href="/quran"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-emerald-600"
						class:bg-emerald-800={$page.url.pathname === '/quran'}
					>
						<span class="text-lg">📖</span>
						<span>Al-Quran</span>
					</a>
					<a
						href="/prayer-times"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-emerald-600"
						class:bg-emerald-800={$page.url.pathname === '/prayer-times'}
					>
						<span class="text-lg">🕌</span>
						<span>Prayer Times</span>
					</a>
					<a
						href="/bookmarks"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-emerald-600"
						class:bg-emerald-800={$page.url.pathname === '/bookmarks'}
					>
						<span class="text-lg">🔖</span>
						<span>Bookmarks</span>
					</a>
					<a
						href="/settings"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-emerald-600"
						class:bg-emerald-800={$page.url.pathname === '/settings'}
					>
						<span class="text-lg">⚙️</span>
						<span>Settings</span>
					</a>
				</nav>
			</div>
		{/if}
	</div>
</header>
