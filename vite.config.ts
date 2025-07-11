import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			strict: false
		}
	},
	optimizeDeps: {
		include: ['@lucide/svelte']
	},
	build: {
		target: 'es2020',
		rollupOptions: {
			output: {
				manualChunks: {
					lucide: ['@lucide/svelte']
				}
			}
		}
	}
});
