<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Trash2, Edit3, ExternalLink, BookOpen } from '@lucide/svelte';
	import type { Bookmark } from '../types';
	import { cn } from '$lib/utils';
	import { quranSettings } from '$modules/settings';
	import { currentTheme, themeUtils } from '$lib/utils/theme';
	import { t, currentLanguage, languageUtils } from '$lib/utils/i18n';

	interface Props {
		bookmark: Bookmark;
		showActions?: boolean;
	}

	const { bookmark, showActions = true }: Props = $props();

	const dispatch = createEventDispatcher<{
		delete: string;
		updateNote: { id: string; note: string };
		goToVerse: { surah: number; verse: number };
	}>();  let isEditing = $state(false);
  let editedNote = $state(bookmark.note || '');

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
		return languageUtils.formatDate(timestamp, $currentLanguage);
	}

	// Theme-aware classes
	const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));
</script>

<div
	class={cn(
		'rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm',
		themeClasses.card,
		themeClasses.cardHover
	)}
>
	<!-- Header with Surah and Verse info -->
	<div class={cn('px-6 py-5 border-b', themeClasses.bgSecondary, themeClasses.border)}>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div
					class={cn('p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md')}
				>
					<BookOpen size={24} class="text-white" />
				</div>
				<div>
					<h3 class={cn('font-bold text-xl mb-1', themeClasses.textPrimary)}>
						{bookmark.surahName}
					</h3>
					<div class="flex items-center gap-3">
						<span
							class={cn(
								'text-sm font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700',
								$currentTheme === 'dark' ? 'dark:bg-emerald-900/50 dark:text-emerald-300' : ''
							)}
						>
							{$t('bookmarks.card.verse')}
							{bookmark.verse}
						</span>
						<span class={cn('text-xs', themeClasses.textMuted)}>
							{formatDate(bookmark.timestamp)}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Ayat Content -->
	<div class="px-6 py-6">
		<div class="space-y-6">
			<!-- Arabic Text -->
			<div
				class={cn(
					'text-right text-2xl md:text-3xl font-arabic leading-loose p-6 rounded-xl border-2 border-dashed',
					'bg-gradient-to-br from-amber-50 to-orange-50',
					'border-amber-200',
					$currentTheme === 'dark'
						? 'dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700/50'
						: ''
				)}
			>
				<p
					class={cn(
						'text-amber-900 drop-shadow-sm',
						$currentTheme === 'dark' ? 'dark:text-amber-200' : ''
					)}
				>
					{bookmark.arabicText}
				</p>
			</div>

			<!-- Translation -->
			{#if bookmark.translationText}
				<div
					class={cn(
						'p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm',
						'bg-gradient-to-r from-emerald-50 to-teal-50',
						$currentTheme === 'dark' ? 'dark:from-emerald-900/20 dark:to-teal-900/20' : ''
					)}
				>
					<div class="flex items-center gap-2 mb-3">
						<div class="w-2 h-2 rounded-full bg-emerald-500"></div>
						<p
							class={cn(
								'text-sm font-semibold uppercase tracking-wide',
								themeClasses.textSecondary
							)}
						>
							{$t('bookmarks.card.translation')}
						</p>
					</div>
					<p class={cn('leading-relaxed text-base')}>
						{bookmark.translationText}
					</p>
				</div>
			{/if}

			<!-- Personal Note Section -->
			<div class={cn('border-t pt-6', themeClasses.border)}>
				{#if isEditing}
					<div class="space-y-4">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-blue-500"></div>
							<span
								class={cn(
									'text-sm font-semibold uppercase tracking-wide',
									themeClasses.textSecondary
								)}
							>
								{$t('bookmarks.card.personalNote')}
							</span>
						</div>
						<textarea
							bind:value={editedNote}
							placeholder={$t('bookmarks.card.addNote')}
							class={cn(
								'w-full p-4 rounded-xl border-2 resize-none transition-all duration-200',
								'focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500',
								themeClasses.input
							)}
							rows="4"
						></textarea>
						<div class="flex gap-3">
							<button
								on:click={saveNote}
								class={cn(
									'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg',
									'transform hover:scale-105',
									themeClasses.buttonPrimary
								)}
							>
								{$t('bookmarks.card.save')}
							</button>
							<button
								on:click={cancelEdit}
								class={cn(
									'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
									themeClasses.buttonSecondary
								)}
							>
								{$t('bookmarks.card.cancel')}
							</button>
						</div>
					</div>
				{:else}
					<div>
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-2">
								<div class="w-2 h-2 rounded-full bg-blue-500"></div>
								<span
									class={cn(
										'text-sm font-semibold uppercase tracking-wide',
										themeClasses.textSecondary
									)}
								>
									{$t('bookmarks.card.personalNote')}
								</span>
							</div>
							{#if showActions}
								<button
									on:click={handleEdit}
									class={cn(
										'p-2 rounded-lg transition-colors group',
										themeClasses.bgTertiary,
										'hover:bg-opacity-80'
									)}
									title={$t('bookmarks.card.editNote')}
								>
									<Edit3
										size={16}
										class={cn('transition-colors cursor-pointer', themeClasses.textSecondary)}
									/>
								</button>
							{/if}
						</div>
						{#if bookmark.note}
							<div
								class={cn(
									'p-4 rounded-xl border-2 border-dashed',
									'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
									$currentTheme === 'dark'
										? 'dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700/50'
										: ''
								)}
							>
								<p class={cn('text-sm leading-relaxed italic')}>
									"{bookmark.note}"
								</p>
							</div>
						{:else}
							<div
								class={cn(
									'p-4 rounded-xl border-2 border-dashed',
									themeClasses.bgSecondary,
									themeClasses.border
								)}
							>
								<p class={cn('text-sm italic text-center', themeClasses.textMuted)}>
									{$t('bookmarks.card.noNote')}
								</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Actions Footer -->
	{#if showActions}
		<div class={cn('px-6 py-5 border-t', themeClasses.bgSecondary, themeClasses.border)}>
			<div class="flex gap-3">
				<button
					on:click={handleGoToVerse}
					class={cn(
						'flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl',
						'text-sm font-semibold transition-all duration-200 shadow-md',

						themeClasses.buttonPrimary
					)}
				>
					<ExternalLink size={18} class="group-hover:rotate-12 transition-transform" />
					<span>{$t('bookmarks.card.goToVerse')}</span>
				</button>
				<button
					on:click={handleDelete}
					class={cn(
						'flex items-center gap-2 px-6 py-3 rounded-xl',
						'text-sm font-semibold transition-all duration-200 shadow-md',
						'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
					)}
				>
					<Trash2 size={18} class="group-hover:rotate-12 transition-transform" />
					<span class="hidden sm:inline">{$t('bookmarks.card.delete')}</span>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

	.font-arabic {
		font-family: 'Amiri', serif;
	}
</style>
