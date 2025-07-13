# Theme & Language System Documentation

## Overview
Sistem tema dan bahasa yang telah diimplementasikan untuk mendukung mode light, dark, system, serta multi-bahasa (Indonesia dan English).

## Features Implemented

### 🎨 **Theme System**
- ✅ **Light Mode**: Tema terang dengan warna putih dan abu-abu terang
- ✅ **Dark Mode**: Tema gelap dengan warna abu-abu gelap dan hitam
- ✅ **System Mode**: Mengikuti preferensi sistem operasi pengguna
- ✅ **Auto-detection**: Deteksi otomatis perubahan tema sistem
- ✅ **Persistent Storage**: Menyimpan preferensi tema di localStorage
- ✅ **Smooth Transitions**: Transisi halus antar tema

### 🌍 **Language System**
- ✅ **Bahasa Indonesia**: Bahasa default
- ✅ **English**: Bahasa alternatif
- ✅ **Dynamic Translation**: Terjemahan real-time dengan interpolasi
- ✅ **Persistent Storage**: Menyimpan preferensi bahasa di localStorage
- ✅ **Date Formatting**: Format tanggal sesuai bahasa

### 🔧 **Integration**
- ✅ **Global Theme Classes**: Utility classes yang konsisten
- ✅ **Component Integration**: Semua komponen mendukung tema & bahasa
- ✅ **Header Controls**: Toggle tema dan bahasa di header
- ✅ **Auto-initialization**: Inisialisasi otomatis saat app start

## File Structure

```
src/lib/utils/
├── theme.ts              # Theme management system
├── i18n.ts               # Language & translation system

src/lib/components/shared/
├── ThemeToggle.svelte    # Theme selector component
├── LanguageToggle.svelte # Language selector component
├── ThemeContainer.svelte # Theme-aware wrapper component
```

## Theme System API

### Theme Store
```typescript
import { selectedTheme, currentTheme } from '$lib/utils/theme';

// Get current theme
const theme = get(currentTheme); // 'light' | 'dark'

// Set theme
selectedTheme.set('dark');

// Toggle theme
selectedTheme.toggle();
```

### Theme Classes
```typescript
import { themeUtils } from '$lib/utils/theme';

const themeClasses = themeUtils.getThemeClasses('dark');
// Returns object with theme-aware CSS classes
```

### Available Theme Classes
- **Background**: `bgPrimary`, `bgSecondary`, `bgTertiary`
- **Text**: `textPrimary`, `textSecondary`, `textMuted`
- **Borders**: `border`, `borderLight`
- **Cards**: `card`, `cardHover`
- **Buttons**: `buttonPrimary`, `buttonSecondary`
- **Inputs**: `input`

## Language System API

### Language Store
```typescript
import { currentLanguage } from '$lib/utils/i18n';

// Get current language
const lang = get(currentLanguage); // 'id' | 'en'

// Set language
currentLanguage.set('en');

// Toggle language
currentLanguage.toggle();
```

### Translation Function
```typescript
import { t } from '$lib/utils/i18n';

// Simple translation
$t('nav.home') // "Beranda" or "Home"

// With interpolation
$t('bookmarks.count', { count: 5 }) // "5 bookmark" or "5 bookmarks"
```

## Component Usage

### ThemeToggle
```svelte
<ThemeToggle size="md" showLabel={true} />
```

### LanguageToggle
```svelte
<LanguageToggle size="md" showDropdown={true} />
```

### Theme-aware Components
```svelte
<script>
  import { currentTheme, themeUtils } from '$lib/utils/theme';
  
  const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));
</script>

<div class={cn("p-4", themeClasses.card)}>
  <h1 class={themeClasses.textPrimary}>Title</h1>
  <p class={themeClasses.textSecondary}>Description</p>
</div>
```

## Translation Keys

### Navigation
- `nav.home`, `nav.quran`, `nav.bookmarks`, `nav.prayer-times`, `nav.settings`

### Bookmarks
- `bookmarks.title`, `bookmarks.subtitle`, `bookmarks.empty.title`
- `bookmarks.search.placeholder`, `bookmarks.filter.title`
- `bookmarks.card.arabic`, `bookmarks.card.translation`, `bookmarks.card.note`

### Actions
- `action.start_reading`, `action.search`, `action.filter`
- `action.bookmark`, `action.copy`, `action.share`

### Settings
- `settings.theme`, `settings.language`
- `settings.theme.light`, `settings.theme.dark`, `settings.theme.system`

## Dark Mode Color Scheme

### Background Colors
- **Primary**: `bg-gray-900` (Darkest)
- **Secondary**: `bg-gray-800` (Cards, containers)
- **Tertiary**: `bg-gray-700` (Buttons, inputs)

### Text Colors
- **Primary**: `text-gray-100` (Main text)
- **Secondary**: `text-gray-300` (Descriptions)
- **Muted**: `text-gray-400` (Placeholder, disabled)

### Border Colors
- **Default**: `border-gray-700`
- **Light**: `border-gray-600`

## Light Mode Color Scheme

### Background Colors
- **Primary**: `bg-white`
- **Secondary**: `bg-gray-50`
- **Tertiary**: `bg-gray-100`

### Text Colors
- **Primary**: `text-gray-900`
- **Secondary**: `text-gray-600`
- **Muted**: `text-gray-500`

### Border Colors
- **Default**: `border-gray-200`
- **Light**: `border-gray-100`

## Auto-Initialization

### In Layout
```typescript
import { initializeTheme } from '$lib/utils/theme';
import { initializeLanguage } from '$lib/utils/i18n';

onMount(() => {
  initializeTheme();
  initializeLanguage();
});
```

## CSS Integration

### Global Classes (in app.css)
```css
.dark {
  /* Dark mode variables */
}

.light {
  /* Light mode variables */
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}
```

## Browser Support
- ✅ **Theme Detection**: `prefers-color-scheme` media query
- ✅ **LocalStorage**: Persistent preferences
- ✅ **Language**: `document.documentElement.lang`

## Future Enhancements
- [ ] System font size preferences
- [ ] High contrast mode
- [ ] Arabic language support (RTL)
- [ ] More granular theme customization
- [ ] Import/export theme preferences
- [ ] Accessibility improvements

## Testing
- ✅ Theme switching works in all components
- ✅ Language switching updates all text
- ✅ System theme detection working
- ✅ Persistent storage working
- ✅ Mobile responsiveness maintained

## Performance
- ✅ **Lazy Loading**: Themes loaded only when needed
- ✅ **Efficient Updates**: Only changed elements re-render
- ✅ **Small Bundle**: Minimal impact on app size
- ✅ **Fast Switching**: Instant theme/language changes
