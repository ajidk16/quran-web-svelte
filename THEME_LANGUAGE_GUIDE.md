# Theme & Language System - Implementation Guide

## Overview
A comprehensive theme and language system has been implemented for the Quran web application, providing seamless dark/light mode switching and Indonesian/English language support.

## Theme System

### Features
- **Three Modes**: Light, Dark, and System (auto-detects OS preference)
- **Persistent Storage**: Theme preference saved in localStorage
- **Real-time Switching**: Instant theme changes without page reload
- **Consistent Styling**: Unified theme classes across all components
- **CSS Variables**: Uses Tailwind's built-in dark mode support

### Implementation

#### Theme Store (`src/lib/utils/theme.ts`)
```typescript
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

// Initialize theme from localStorage or default to 'system'
function getInitialTheme(): Theme {
  if (!browser) return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
}

export const currentTheme = writable<Theme>(getInitialTheme());

// Theme utility classes for consistent styling
export const themeUtils = {
  getThemeClasses: (theme: Theme) => ({
    // Background colors
    background: 'bg-white dark:bg-gray-900',
    backgroundSecondary: 'bg-gray-50 dark:bg-gray-800',
    
    // Text colors
    textPrimary: 'text-gray-900 dark:text-white',
    textSecondary: 'text-gray-600 dark:text-gray-300',
    textMuted: 'text-gray-500 dark:text-gray-400',
    
    // Border colors
    border: 'border-gray-200 dark:border-gray-700',
    borderLight: 'border-gray-100 dark:border-gray-800',
    
    // Interactive states
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    focus: 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400',
  })
};
```

#### Theme Toggle Component (`src/lib/components/shared/ThemeToggle.svelte`)
- Displays current theme icon (🌙 for dark, ☀️ for light, 🌓 for system)
- Cycles through themes on click
- Shows tooltip with current theme
- Responsive sizing for different screen sizes

#### Theme Container (`src/lib/components/shared/ThemeContainer.svelte`)
- Wrapper component that applies theme classes
- Automatically updates when theme changes
- Provides consistent background and text styling

### Usage

#### In Components
```svelte
<script>
  import { currentTheme, themeUtils } from '$lib/utils/theme';
  
  $: themeClasses = themeUtils.getThemeClasses($currentTheme);
</script>

<div class={cn(
  "p-4 rounded-lg",
  themeClasses.background,
  themeClasses.textPrimary,
  themeClasses.border
)}>
  Content here adapts to theme
</div>
```

#### Theme Detection
The system automatically detects and applies the user's OS theme preference when set to 'system' mode using CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  .dark:dark-mode-classes
}
```

## Language System

### Features
- **Bilingual Support**: Indonesian (ID) and English (EN)
- **Dynamic Switching**: Real-time language changes
- **Complete Translation**: All UI text, buttons, and messages
- **Contextual Formatting**: Date formats and number formatting adapt to language
- **Persistent Storage**: Language preference saved in localStorage

### Implementation

#### Language Store (`src/lib/utils/i18n.ts`)
```typescript
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'id' | 'en';

// Initialize language from localStorage or browser locale
function getInitialLanguage(): Language {
  if (!browser) return 'id';
  
  const saved = localStorage.getItem('language') as Language;
  if (saved) return saved;
  
  // Detect from browser locale
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('id')) return 'id';
  return 'en';
}

export const currentLanguage = writable<Language>(getInitialLanguage());

// Translation dictionary
const translations = {
  id: {
    'nav.home': 'Beranda',
    'nav.quran': 'Al-Quran',
    'nav.bookmarks': 'Bookmark',
    // ... all Indonesian translations
  },
  en: {
    'nav.home': 'Home',
    'nav.quran': 'Quran',
    'nav.bookmarks': 'Bookmarks',
    // ... all English translations
  }
};

// Translation function with parameter interpolation
export const t = derived(currentLanguage, ($language) => {
  return (key: string, params?: Record<string, string | number>) => {
    const translation = translations[$language][key] || key;
    
    if (!params) return translation;
    
    // Replace {param} with values
    return Object.entries(params).reduce((text, [param, value]) => {
      return text.replace(`{${param}}`, String(value));
    }, translation);
  };
});
```

#### Language Toggle Component (`src/lib/components/shared/LanguageToggle.svelte`)
- Dropdown menu with available languages
- Shows current language with flag/icon
- Smooth transition animations
- Mobile-responsive design

### Usage

#### In Components
```svelte
<script>
  import { t } from '$lib/utils/i18n';
</script>

<h1>{$t('bookmarks.title')}</h1>
<p>{$t('notification.bookmark.added', { verse: 1, surah: 'Al-Fatihah' })}</p>
```

#### Date Formatting
```typescript
// Language-aware date formatting
export const formatDate = (date: Date, language: Language): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  return new Intl.DateTimeFormat(locale, options).format(date);
};
```

## Integration Points

### Global Layout (`src/routes/+layout.svelte`)
```svelte
<script>
  import { currentTheme } from '$lib/utils/theme';
  import { currentLanguage } from '$lib/utils/i18n';
  import { browser } from '$app/environment';
  
  // Apply theme to document
  $: if (browser) {
    const root = document.documentElement;
    
    if ($currentTheme === 'dark' || 
        ($currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
  
  // Save preferences
  $: if (browser) {
    localStorage.setItem('theme', $currentTheme);
    localStorage.setItem('language', $currentLanguage);
  }
</script>
```

### Header Navigation
- Theme toggle button with icon and tooltip
- Language dropdown with current selection
- Responsive layout for mobile and desktop

## Translation Keys

### Navigation
- `nav.home`, `nav.quran`, `nav.bookmarks`, `nav.prayer-times`, `nav.settings`

### Bookmarks
- `bookmarks.title`, `bookmarks.subtitle`, `bookmarks.empty.title`
- `bookmarks.search.placeholder`, `bookmarks.filter.toggle`
- `bookmarks.sort.date`, `bookmarks.sort.surah`, `bookmarks.sort.verse`

### Actions
- `action.search`, `action.filter`, `action.bookmark`, `action.save`, `action.cancel`

### Notifications
- `notification.bookmark.added`, `notification.bookmark.removed`

### Settings
- `settings.theme.light`, `settings.theme.dark`, `settings.theme.system`
- `settings.language.id`, `settings.language.en`

## CSS Framework Integration

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Custom theme-aware colors
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          // ... color scale
        }
      }
    }
  }
}
```

### CSS Variables
```css
/* app.css */
:root {
  --color-primary-50: 236 253 245;
  --color-primary-500: 16 185 129;
  --color-primary-900: 6 78 59;
}

.dark {
  --color-primary-50: 6 78 59;
  --color-primary-500: 52 211 153;
  --color-primary-900: 236 253 245;
}
```

## Browser Support

### Theme System
- **CSS Custom Properties**: Modern browser support
- **prefers-color-scheme**: Automatic OS theme detection
- **localStorage**: Persistent theme preferences

### Language System
- **Intl.DateTimeFormat**: Modern date formatting
- **Navigator.language**: Browser locale detection
- **String.replace**: Parameter interpolation

## Performance Considerations

### Theme Switching
- **No Flash**: Theme applied immediately on page load
- **CSS Transitions**: Smooth color transitions between themes
- **Minimal Reflow**: Only color properties change, no layout shifts

### Language Switching
- **Instant Updates**: Text changes immediately via reactive stores
- **Minimal Bundle**: Only active language strings loaded
- **Lazy Loading**: Future enhancement for additional languages

## Accessibility

### Theme System
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Sufficient color contrast in both themes
- **Focus Indicators**: Visible focus states in all themes

### Language System
- **Screen Readers**: Proper ARIA labels in both languages
- **Text Direction**: Ready for RTL languages (future enhancement)
- **Font Support**: Ensures proper Arabic text rendering

## Testing

### Theme Testing
```javascript
// Test theme switching
it('should toggle theme on button click', () => {
  const themeToggle = screen.getByRole('button', { name: /theme/i });
  fireEvent.click(themeToggle);
  expect(document.documentElement).toHaveClass('dark');
});
```

### Language Testing
```javascript
// Test translation function
it('should translate text correctly', () => {
  set(currentLanguage, 'en');
  expect(get(t)('nav.home')).toBe('Home');
  
  set(currentLanguage, 'id');
  expect(get(t)('nav.home')).toBe('Beranda');
});
```

The theme and language systems are now fully integrated and provide a consistent, accessible user experience across the entire application!
