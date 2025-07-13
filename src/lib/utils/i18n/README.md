# 🌐 Internationalization (i18n) System

This directory contains the internationalization system for the Quran web application.

## 📁 Structure

```
src/lib/utils/i18n/
├── index.ts              # Main i18n module with store and utilities
├── locales/              # Translation files
│   ├── index.ts          # Locale exports
│   ├── id.json           # Indonesian translations
│   └── en.json           # English translations
└── README.md             # This file
```

## 🚀 Usage

### Basic Translation

```typescript
import { t } from '$lib/utils/i18n';

// In Svelte component
$t('nav.home')                    // "Beranda" (ID) or "Home" (EN)
$t('bookmarks.title')             // "Bookmark Ayat" (ID) or "Bookmarked Verses" (EN)
```

### Translation with Parameters

```typescript
// With interpolation
$t('bookmarks.count', { count: 5 })        // "5 bookmark" (ID) or "5 bookmarks" (EN)
$t('notification.bookmark.added', { 
  verse: 1, 
  surah: 'Al-Fatihah' 
})
```

### Language Management

```typescript
import { currentLanguage, languageUtils } from '$lib/utils/i18n';

// Get current language
const lang = $currentLanguage;              // 'id' | 'en'

// Change language
currentLanguage.set('en');                  // Set to English
currentLanguage.toggle();                   // Toggle between ID and EN

// Get language info
const info = languageUtils.getCurrentLanguageInfo($currentLanguage);
// { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
```

## 📋 Available Languages

- **Indonesian** (`id`) - Bahasa Indonesia 🇮🇩
- **English** (`en`) - English 🇺🇸

## 🔧 Adding New Translations

### 1. Add to JSON Files

**id.json:**
```json
{
  "new_section": {
    "title": "Judul Baru",
    "description": "Deskripsi dalam bahasa Indonesia"
  },
  "prayer": {
    "times": "Waktu Sholat",
    "fajr": "Subuh", 
    "dhuhr": "Dzuhur",
    "asr": "Ashar",
    "maghrib": "Maghrib",
    "isha": "Isya",
    "next_prayer": "Sholat berikutnya: {prayer} dalam {time}"
  },
  "quran": {
    "reading": {
      "continue": "Lanjutkan Membaca",
      "last_read": "Terakhir dibaca: Surah {surah} Ayat {verse}",
      "bookmark_this": "Bookmark ayat ini"
    }
  }
}
```

**en.json:**
```json
{
  "new_section": {
    "title": "New Title", 
    "description": "Description in English"
  },
  "prayer": {
    "times": "Prayer Times",
    "fajr": "Fajr",
    "dhuhr": "Dhuhr", 
    "asr": "Asr",
    "maghrib": "Maghrib",
    "isha": "Isha",
    "next_prayer": "Next prayer: {prayer} in {time}"
  },
  "quran": {
    "reading": {
      "continue": "Continue Reading",
      "last_read": "Last read: Surah {surah} Verse {verse}",
      "bookmark_this": "Bookmark this verse"
    }
  }
}
```

### 2. Use in Components

```svelte
<script>
  import { t } from '$lib/utils/i18n';
</script>

<h1>{$t('new_section.title')}</h1>
<p>{$t('new_section.description')}</p>

<!-- Prayer times example -->
<h2>{$t('prayer.times')}</h2>
<p>{$t('prayer.next_prayer', { prayer: 'Fajr', time: '2 hours' })}</p>

<!-- Quran reading example -->
<button>{$t('quran.reading.continue')}</button>
<p>{$t('quran.reading.last_read', { surah: 'Al-Fatihah', verse: 1 })}</p>
```

## 🎯 Translation Key Conventions

Use dot notation for nested keys:

- `nav.*` - Navigation items
- `bookmarks.*` - Bookmark-related text
- `action.*` - Common action buttons
- `settings.*` - Settings page text
- `notification.*` - Toast notifications

## 🛠️ Utilities

### Date Formatting

```typescript
import { languageUtils } from '$lib/utils/i18n';

const formatted = languageUtils.formatDate(new Date(), 'id');
// "13 Juli 2025 21:16" (ID) or "July 13, 2025 09:16 PM" (EN)
```

### Language Info

```typescript
// Get all available languages
const languages = languageUtils.getAvailableLanguages();
// [{ code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }, ...]

// Apply language to document
languageUtils.applyLanguage('en');  // Sets html lang attribute
```

## 🔄 Migration from Old System

The old flat key system (`'nav.home'`) is now organized into nested JSON structure:

**Old:**
```typescript
'nav.home': 'Beranda'
```

**New:**
```json
{
  "nav": {
    "home": "Beranda"
  }
}
```

The API remains the same - `$t('nav.home')` still works!

## 📝 Features

- ✅ **Reactive Language Switching** - UI updates automatically
- ✅ **Parameter Interpolation** - `{count}`, `{verse}`, etc.
- ✅ **Nested Key Support** - `section.subsection.key`
- ✅ **LocalStorage Persistence** - Language preference saved
- ✅ **SSR Compatible** - Works with SvelteKit
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Backward Compatible** - Existing imports still work

## 🔧 Configuration

The default language is Indonesian (`id`). To change:

```typescript
// In i18n/index.ts
const defaultLanguage: Language = 'en';  // Change to English default
```

## 🌍 Future Enhancements

- [ ] Pluralization support
- [ ] Arabic language support (RTL)
- [ ] Lazy loading of translation files
- [ ] Translation validation tools
- [ ] ICU message format support
