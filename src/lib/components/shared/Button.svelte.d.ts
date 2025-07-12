import type { Component } from 'svelte';

export interface ButtonProps {
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	disabled?: boolean;
	loading?: boolean;
	class?: string;
	onclick?: (event: MouseEvent) => void;
	type?: 'button' | 'submit' | 'reset';
}

declare const Button: Component<ButtonProps>;
export default Button;
