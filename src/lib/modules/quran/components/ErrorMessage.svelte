<script lang="ts">
	export let error: string;
</script>

<div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
	<div class="text-red-500 text-5xl mb-4">⚠️</div>
	<h3 class="text-lg font-semibold text-red-800 mb-2">Terjadi Kesalahan</h3>
	<p class="text-red-600">{error}</p>
</div>
