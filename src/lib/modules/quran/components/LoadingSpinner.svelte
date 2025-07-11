<script lang="ts">
	export let message: string = 'Memuat...';
</script>

<div class="flex flex-col items-center justify-center py-20">
	<div class="relative">
		<div class="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
		<div
			class="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
		></div>
	</div>
	<p class="text-gray-600 mt-4 text-lg">{message}</p>
</div>
