<script lang="ts">
	import { currentTheme, selectedTheme } from '$lib/utils/theme';
	import { onMount } from 'svelte';
	
	let htmlClasses = $state('');
	let bodyClasses = $state('');
	let dataTheme = $state('');
	let localStorageTheme = $state('');
	
	onMount(() => {
		const updateInfo = () => {
			htmlClasses = document.documentElement.className;
			bodyClasses = document.body.className;
			dataTheme = document.documentElement.getAttribute('data-theme') || 'none';
			localStorageTheme = localStorage.getItem('app-theme') || 'none';
		};
		
		// Update immediately
		updateInfo();
		
		// Watch for changes
		const observer = new MutationObserver(updateInfo);
		observer.observe(document.documentElement, { 
			attributes: true, 
			attributeFilter: ['class', 'data-theme'] 
		});
		observer.observe(document.body, { 
			attributes: true, 
			attributeFilter: ['class'] 
		});
		
		// Also watch for localStorage changes
		window.addEventListener('storage', updateInfo);
		
		return () => {
			observer.disconnect();
			window.removeEventListener('storage', updateInfo);
		};
	});
</script>

<!-- Debug panel (only show in dev mode) -->
{#if import.meta.env.DEV}
	<div class="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-xs z-50">
		<div class="mb-2 font-bold">🔧 Theme Debug</div>
		<div><strong>Selected:</strong> {$selectedTheme}</div>
		<div><strong>Current:</strong> {$currentTheme}</div>
		<div><strong>localStorage:</strong> {localStorageTheme}</div>
		<div><strong>data-theme:</strong> {dataTheme}</div>
		<div><strong>HTML Classes:</strong> {htmlClasses || 'none'}</div>
		<div><strong>Body Classes:</strong> {bodyClasses || 'none'}</div>
		<div class="mt-2 space-x-2">
			<button 
				onclick={() => selectedTheme.set('light')}
				class="bg-yellow-500 px-2 py-1 rounded text-black">Light</button>
			<button 
				onclick={() => selectedTheme.set('dark')}
				class="bg-gray-800 px-2 py-1 rounded">Dark</button>
			<button 
				onclick={() => selectedTheme.set('system')}
				class="bg-blue-500 px-2 py-1 rounded">System</button>
		</div>
	</div>
{/if}
