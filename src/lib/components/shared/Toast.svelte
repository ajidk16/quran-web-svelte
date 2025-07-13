<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { CheckCircle, X, AlertCircle, Info, BookmarkCheck, Bookmark } from '@lucide/svelte';

	export let type: 'success' | 'error' | 'info' | 'bookmark' = 'info';
	export let title: string;
	export let message: string = '';
	export let duration: number = 3000;
	export let show: boolean = true;

	const dispatch = createEventDispatcher();

	let timeout: ReturnType<typeof setTimeout>;

	$: if (show && duration > 0) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			close();
		}, duration);
	}

	function close() {
		show = false;
		dispatch('close');
	}

	function getIcon() {
		switch (type) {
			case 'success':
				return CheckCircle;
			case 'error':
				return AlertCircle;
			case 'bookmark':
				return BookmarkCheck;
			default:
				return Info;
		}
	}

	function getColors() {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'bookmark':
				return 'bg-emerald-50 border-emerald-200 text-emerald-800';
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800';
		}
	}
</script>

{#if show}
	<div
		in:fly={{ y: -50, duration: 300 }}
		out:fly={{ y: -50, duration: 200 }}
		class="fixed top-4 right-4 z-50 min-w-80 max-w-sm"
	>
		<div class="border rounded-lg shadow-lg backdrop-blur-sm {getColors()} p-4">
			<div class="flex items-start space-x-3">
				<svelte:component this={getIcon()} size={20} class="mt-0.5 flex-shrink-0" />
				<div class="flex-1 min-w-0">
					<p class="font-semibold">{title}</p>
					{#if message}
						<p class="text-sm opacity-80 mt-1">{message}</p>
					{/if}
				</div>
				<button
					on:click={close}
					class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
				>
					<X size={16} />
				</button>
			</div>
		</div>
	</div>
{/if}
