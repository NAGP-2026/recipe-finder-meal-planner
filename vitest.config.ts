import { defineConfig } from 'vitest/config';

/**
 * Root-level Vitest config.
 * Scopes test discovery to recipe-app/src only —
 * Playwright E2E tests in recipe-app/tests/ are excluded here;
 * run them separately via: cd recipe-app && npx playwright test
 */
export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['recipe-app/src/**/*.test.ts'],
		exclude: ['recipe-app/tests/**', '**/node_modules/**'],
		setupFiles: ['recipe-app/src/test-setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json-summary'],
		},
		// DOMPurify initialises against the browser DOM at import time.
		// Inlining it ensures Vite transforms it inside the jsdom worker
		// rather than loading it as an external CJS module, which avoids
		// the "Timeout waiting for worker to respond" startup error.
		server: {
			deps: {
				inline: ['dompurify'],
			},
		},
	},
});
