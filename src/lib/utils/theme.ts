import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

// Theme store
const createThemeStore = () => {
	const defaultTheme: Theme = 'system';
	
	// Load theme from localStorage
	const getStoredTheme = (): Theme => {
		if (!browser) return defaultTheme;
		try {
			const stored = localStorage.getItem('app-theme') as Theme;
			return stored && ['light', 'dark', 'system'].includes(stored) ? stored : defaultTheme;
		} catch {
			return defaultTheme;
		}
	};

	const { subscribe, set, update } = writable<Theme>(getStoredTheme());

	return {
		subscribe,
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('app-theme', theme);
			}
			set(theme);
		},
		update,
		toggle: () => {
			update(current => {
				const newTheme = current === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('app-theme', newTheme);
				}
				return newTheme;
			});
		}
	};
};

export const selectedTheme = createThemeStore();

// Derived store for actual theme (resolves 'system' to actual theme)
export const currentTheme = derived(selectedTheme, ($selectedTheme) => {
	if ($selectedTheme === 'system') {
		if (!browser) return 'light';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	return $selectedTheme;
});

// Theme utilities
export const themeUtils = {
	// Apply theme to document
	applyTheme: (theme: 'light' | 'dark') => {
		if (!browser) return;
		
		const root = document.documentElement;
		const body = document.body;
		
		// Remove existing theme classes
		root.classList.remove('light', 'dark');
		body.classList.remove('light', 'dark');
		
		// Add the new theme class to both html and body
		root.classList.add(theme);
		body.classList.add(theme);
		
		// Update data-theme attribute
		root.setAttribute('data-theme', theme);
		
		// Force update CSS custom properties
		if (theme === 'dark') {
			root.style.setProperty('--app-bg-primary', '#111827');
			root.style.setProperty('--app-bg-secondary', '#1f2937');
			root.style.setProperty('--app-text-primary', '#f9fafb');
			root.style.setProperty('--app-text-secondary', '#d1d5db');
		} else {
			root.style.setProperty('--app-bg-primary', '#ffffff');
			root.style.setProperty('--app-bg-secondary', '#f9fafb');
			root.style.setProperty('--app-text-primary', '#111827');
			root.style.setProperty('--app-text-secondary', '#4b5563');
		}
		
		// Update meta theme-color
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
		}
		
		// Ensure the class is applied immediately
		root.style.colorScheme = theme;
		
		console.log('🎨 Theme applied:', theme, 'Root classes:', root.className, 'data-theme:', root.getAttribute('data-theme'));
	},

	// Get CSS classes for theme (Tailwind 4 compatible)
	getThemeClasses: (theme: 'light' | 'dark') => ({
		// Background colors using Tailwind 4 dark: modifier
		bgPrimary: 'bg-white dark:bg-gray-900',
		bgSecondary: 'bg-gray-50 dark:bg-gray-800',
		bgTertiary: 'bg-gray-100 dark:bg-gray-700',
		bgQuran: 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
		
		// Header backgrounds
		bgQuranHeader: 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900',
		
		// Text colors using Tailwind 4 dark: modifier
		textPrimary: 'text-gray-900 dark:text-gray-100',
		textSecondary: 'text-gray-600 dark:text-gray-300',
		textMuted: 'text-gray-500 dark:text-gray-400',
		
		// Border colors using Tailwind 4 dark: modifier
		border: 'border-gray-200 dark:border-gray-700',
		borderLight: 'border-gray-100 dark:border-gray-600',
		
		// Card styles using Tailwind 4 dark: modifier
		card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl',
		cardHover: 'hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-xl dark:hover:shadow-2xl',
		
		// Button styles using Tailwind 4 dark: modifier
		buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white',
		buttonSecondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600',
		
		// Input styles using Tailwind 4 dark: modifier
		input: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500',
		
		// Modal and overlay styles
		modal: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
		overlay: 'bg-black/50 dark:bg-black/70',
		
		// Navigation styles
		nav: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700',
		navItem: 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400',
		
		// Toast and notification styles
		toast: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl',
		toastSuccess: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
		toastError: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
		
		// Loading and skeleton styles
		skeleton: 'bg-gray-200 dark:bg-gray-700 animate-pulse',
		loading: 'text-gray-500 dark:text-gray-400',
	}),

	// Listen to system theme changes
	watchSystemTheme: (callback: (isDark: boolean) => void) => {
		if (!browser) return () => {};
		
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = (e: MediaQueryListEvent) => callback(e.matches);
		
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}
};

// Initialize theme system
export const initializeTheme = () => {
	if (!browser) return;

	// Apply initial theme immediately
	const initialTheme = get(currentTheme);
	themeUtils.applyTheme(initialTheme);

	// Watch for theme changes and apply them
	currentTheme.subscribe(theme => {
		themeUtils.applyTheme(theme);
	});

	// Watch for system theme changes when using 'system' mode
	const cleanup = themeUtils.watchSystemTheme((isDark) => {
		const currentSelectedTheme = get(selectedTheme);
		if (currentSelectedTheme === 'system') {
			themeUtils.applyTheme(isDark ? 'dark' : 'light');
		}
	});

	return cleanup;
};
