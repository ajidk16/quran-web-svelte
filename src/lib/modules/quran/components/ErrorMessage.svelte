<script lang="ts">
	export let error: string;
</script>

<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md mx-auto">
	<div class="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
	<h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Terjadi Kesalahan</h3>
	<p class="text-red-600 dark:text-red-300">{error}</p>
</div>
