<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Trash2, Edit3, ExternalLink, BookOpen } from '@lucide/svelte';
	import type { Bookmark } from '../types';
	import { cn } from '$lib/utils';

	export let bookmark: Bookmark;
	export let showActions = true;

	const dispatch = createEventDispatcher();

	let isEditing = false;
	let editedNote = bookmark.note || '';

	function handleDelete() {
		dispatch('delete', bookmark.id);
	}

	function handleEdit() {
		isEditing = true;
		editedNote = bookmark.note || '';
	}

	function saveNote() {
		dispatch('updateNote', { id: bookmark.id, note: editedNote });
		isEditing = false;
	}

	function cancelEdit() {
		isEditing = false;
		editedNote = bookmark.note || '';
	}

	function handleGoToVerse() {
		dispatch('goToVerse', { surah: bookmark.surah, verse: bookmark.verse });
	}

	function formatDate(timestamp: string) {
		return new Date(timestamp).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
	<!-- Header -->
	<div class="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
					<BookOpen size={20} class="text-white" />
				</div>
				<div>
					<h3 class="text-white font-semibold text-lg">{bookmark.surahNameLatin}</h3>
					<p class="text-white/80 text-sm">Ayat {bookmark.verse}</p>
				</div>
			</div>
			<div class="text-white/80 text-sm">
				{formatDate(bookmark.timestamp)}
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="p-6">
		<!-- Arabic Text -->
		<div class="mb-6">
			<div class="flex items-center mb-3">
				<div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
					<div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
				</div>
				<p class="text-sm text-emerald-700 uppercase tracking-wide font-semibold">
					Teks Arab
				</p>
			</div>
			<p class="text-2xl text-right leading-loose text-gray-800 font-arabic bg-emerald-50 p-4 rounded-xl">
				{bookmark.arabicText}
			</p>
		</div>

		<!-- Transliteration -->
		<div class="mb-6">
			<div class="flex items-center mb-3">
				<div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
					<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
				</div>
				<p class="text-sm text-blue-700 uppercase tracking-wide font-semibold">
					Transliterasi
				</p>
			</div>
			<p class="text-lg italic text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl">
				{bookmark.transliterationText}
			</p>
		</div>

		<!-- Translation -->
		<div class="mb-6">
			<div class="flex items-center mb-3">
				<div class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3">
					<div class="w-2 h-2 bg-teal-600 rounded-full"></div>
				</div>
				<p class="text-sm text-teal-700 uppercase tracking-wide font-semibold">Terjemahan</p>
			</div>
			<p class="text-lg text-gray-800 leading-relaxed bg-teal-50 p-4 rounded-xl">
				{bookmark.translationText}
			</p>
		</div>

		<!-- Note Section -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-3">
				<div class="flex items-center">
					<div class="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3">
						<div class="w-2 h-2 bg-amber-600 rounded-full"></div>
					</div>
					<p class="text-sm text-amber-700 uppercase tracking-wide font-semibold">Catatan</p>
				</div>
				{#if showActions && !isEditing}
					<button
						on:click={handleEdit}
						class="text-amber-600 hover:text-amber-800 transition-colors p-1"
						title="Edit catatan"
					>
						<Edit3 size={16} />
					</button>
				{/if}
			</div>

			{#if isEditing}
				<div class="space-y-3">
					<textarea
						bind:value={editedNote}
						placeholder="Tambahkan catatan untuk ayat ini..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
						rows="3"
					></textarea>
					<div class="flex justify-end space-x-2">
						<button
							on:click={cancelEdit}
							class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
						>
							Batal
						</button>
						<button
							on:click={saveNote}
							class="px-4 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
						>
							Simpan
						</button>
					</div>
				</div>
			{:else}
				<div class="bg-amber-50 p-4 rounded-xl">
					{#if bookmark.note}
						<p class="text-gray-700 leading-relaxed">{bookmark.note}</p>
					{:else}
						<p class="text-gray-500 italic">Belum ada catatan</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Actions -->
		{#if showActions}
			<div class="flex justify-between items-center pt-4 border-t border-gray-100">
				<button
					on:click={handleGoToVerse}
					class="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
				>
					<ExternalLink size={16} />
					<span>Buka Ayat</span>
				</button>

				<button
					on:click={handleDelete}
					class="inline-flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					title="Hapus bookmark"
				>
					<Trash2 size={16} />
					<span>Hapus</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

	.font-arabic {
		font-family: 'Amiri', serif;
	}
</style>
