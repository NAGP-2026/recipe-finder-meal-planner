import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 *
 * Default: spins up `npm run preview` (production build) on port 4173.
 * Override the target URL at runtime:
 *   BASE_URL=https://recipe-finder-meal-planner-ten.vercel.app npx playwright test
 */
export default defineConfig({
	testDir: './tests',
	timeout: 30_000,          // 30 s — live API calls can be slow
	expect: { timeout: 10_000 },
	fullyParallel: false,     // avoid rate-limiting the real API during tests
	retries: 1,               // retry once on flake
	reporter: [['list'], ['html', { open: 'never' }]],

	use: {
		baseURL: process.env.BASE_URL ?? 'http://localhost:4173',
		headless: true,
		screenshot: 'only-on-failure',
		video: 'off',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	// Auto-start the preview server when running locally (skipped if BASE_URL is set)
	webServer: process.env.BASE_URL
		? undefined
		: {
				command: 'npm run build && npm run preview',
				port: 4173,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
		  },
});
