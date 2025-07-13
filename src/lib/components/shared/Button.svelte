<script lang="ts">
    import { cn } from '$lib/utils/cn';
    import { currentTheme, themeUtils } from '$lib/utils/theme';

    const {
        variant = 'default',
        size = 'default',
        disabled = false,
        loading = false,
        type = 'button',
        className = '',
        onclick
    }: {
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
        size?: 'default' | 'sm' | 'lg' | 'icon';
        disabled?: boolean;
        loading?: boolean;
        type?: 'button' | 'submit' | 'reset';
        className?: string;
        onclick?: (event: MouseEvent) => void;
    } = $props();

    const themeClasses = $derived(themeUtils.getThemeClasses($currentTheme));

    const variants = $derived({
        default: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: `border ${themeClasses.border} bg-transparent ${themeClasses.textSecondary} hover:${themeClasses.bgSecondary} focus:ring-gray-500`,
        secondary: `${themeClasses.bgSecondary} ${themeClasses.textPrimary} hover:${themeClasses.bgTertiary} focus:ring-gray-500`,
        ghost: `bg-transparent ${themeClasses.textSecondary} hover:${themeClasses.bgSecondary} focus:ring-gray-500`,
        link: 'bg-transparent text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline focus:ring-emerald-500'
    });

    const sizes = {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-12 px-8 py-3 text-base',
        icon: 'h-10 w-10 p-0'
    };

    const classes = $derived(cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
    ));
</script>

<button
    class={classes}
    {type}
    disabled={disabled || loading}
    on:click={onclick}
>
    {#if loading}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
    {/if}
    <slot />
</button>
