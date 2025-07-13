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
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
		
		// Update meta theme-color
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
		}
	},

	// Get CSS classes for theme
	getThemeClasses: (theme: 'light' | 'dark') => ({
		// Background colors
		bgPrimary: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
		bgSecondary: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
		bgTertiary: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
		
		// Text colors
		textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
		textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
		textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
		
		// Border colors
		border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
		borderLight: theme === 'dark' ? 'border-gray-600' : 'border-gray-100',
		
		// Card styles
		card: theme === 'dark' 
			? 'bg-gray-800 border-gray-700 shadow-xl' 
			: 'bg-white border-gray-200 shadow-lg',
		cardHover: theme === 'dark' 
			? 'hover:bg-gray-750 hover:shadow-2xl' 
			: 'hover:bg-gray-50 hover:shadow-xl',
		
		// Button styles
		buttonPrimary: theme === 'dark'
			? 'bg-emerald-600 hover:bg-emerald-700 text-white'
			: 'bg-emerald-600 hover:bg-emerald-700 text-white',
		buttonSecondary: theme === 'dark'
			? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600'
			: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
		
		// Input styles
		input: theme === 'dark'
			? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-emerald-500'
			: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500',
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

	// Watch for theme changes and apply them
	currentTheme.subscribe(theme => {
		themeUtils.applyTheme(theme);
	});

	// Watch for system theme changes when using 'system' mode
	selectedTheme.subscribe(theme => {
		if (theme === 'system') {
			const cleanup = themeUtils.watchSystemTheme((isDark) => {
				themeUtils.applyTheme(isDark ? 'dark' : 'light');
			});
			
			// Apply initial system theme
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			themeUtils.applyTheme(isDark ? 'dark' : 'light');
			
			return cleanup;
		}
	});
};
