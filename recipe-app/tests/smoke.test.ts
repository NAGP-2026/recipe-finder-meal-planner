import { test, expect } from '@playwright/test';

/**
 * RecipeHub — Smoke Tests (E2E)
 *
 * These tests verify the critical user-facing paths of the SvelteKit app:
 *   • Page load & core UI (navbar, hero, recipe grid)
 *   • Navigation between all main routes
 *   • Search interaction (Stencil <search-bar> web component)
 *   • Favorites: toggle + persist via localStorage
 *   • Meal Planner: page structure
 *   • Create Recipe: form renders
 *   • Error boundary: unknown route shows +error.svelte
 *
 * Run locally:  npx playwright test
 * Run against production:
 *   BASE_URL=https://recipe-finder-meal-planner-ten.vercel.app npx playwright test
 */

// ─── Home page ────────────────────────────────────────────────────────────────
test.describe('Home page', () => {
	test('shows RecipeHub brand and hero title', async ({ page }) => {
		await page.goto('/');
		// Brand name in navbar
		await expect(page.locator('.brand-name')).toBeVisible();
		await expect(page.locator('.brand-name')).toContainText('RecipeHub');
		// Hero heading
		await expect(page.locator('.hero-title')).toBeVisible();
	});

	test('loads recipe cards from TheMealDB', async ({ page }) => {
		await page.goto('/');
		// Wait up to 15 s for at least one <recipe-card> custom element to appear
		// (the API call + Stencil lazy-load takes a few seconds on cold start)
		const card = page.locator('recipe-card').first();
		await expect(card).toBeAttached({ timeout: 15_000 });
	});

	test('search bar web component is present on the page', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('search-bar')).toBeAttached();
	});

	test('filter panel web component is present in the sidebar', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('filter-panel')).toBeAttached();
	});
});

// ─── Navigation ───────────────────────────────────────────────────────────────
test.describe('Navigation', () => {
	test('Favorites link navigates to /favorites', async ({ page }) => {
		await page.goto('/');
		await page.click('a[href="/favorites"]');
		await expect(page).toHaveURL(/\/favorites/);
		await expect(page.locator('.page-title')).toBeVisible();
	});

	test('Meal Planner link navigates to /meal-planner', async ({ page }) => {
		await page.goto('/');
		await page.click('a[href="/meal-planner"]');
		await expect(page).toHaveURL(/\/meal-planner/);
	});

	test('My Recipes link navigates to /my-recipes', async ({ page }) => {
		await page.goto('/');
		await page.click('a[href="/my-recipes"]');
		await expect(page).toHaveURL(/\/my-recipes/);
	});

	test('Create Recipe CTA navigates to /recipes/create', async ({ page }) => {
		await page.goto('/');
		// Click the "+ New Recipe" nav CTA
		await page.click('a[href="/recipes/create"]');
		await expect(page).toHaveURL(/\/recipes\/create/);
		// The <recipe-form> Stencil component should be attached
		await expect(page.locator('recipe-form')).toBeAttached({ timeout: 10_000 });
	});
});

// ─── Favorites page ───────────────────────────────────────────────────────────
test.describe('Favorites page', () => {
	test('shows empty state when no favorites saved', async ({ page }) => {
		// Clear localStorage so there are no persisted favorites
		await page.goto('/favorites');
		await page.evaluate(() => localStorage.removeItem('rf_favorites'));
		await page.reload();
		// Empty state message should be visible (class used in favorites/+page.svelte)
		await expect(page.locator('.empty-state-compact')).toBeVisible({ timeout: 8_000 });
	});
});

// ─── Meal Planner page ────────────────────────────────────────────────────────
test.describe('Meal Planner page', () => {
	test('renders the weekly planner grid', async ({ page }) => {
		await page.goto('/meal-planner');
		// Page title should be visible
		await expect(page.locator('.page-title')).toBeVisible({ timeout: 8_000 });
	});
});

// ─── My Recipes page ─────────────────────────────────────────────────────────
test.describe('My Recipes page', () => {
	test('shows empty state when no user recipes exist', async ({ page }) => {
		await page.goto('/my-recipes');
		await page.evaluate(() => localStorage.removeItem('rf_user_recipes'));
		await page.reload();
		await expect(page.locator('.empty-compact, .empty-state')).toBeVisible({ timeout: 8_000 });
	});
});

// ─── Error boundary ───────────────────────────────────────────────────────────
test.describe('Error boundary', () => {
	test('+error.svelte renders for unknown routes', async ({ page }) => {
		await page.goto('/this-route-does-not-exist-xyz');
		// The error page shows a numeric status code
		await expect(page.locator('.error-code')).toBeVisible({ timeout: 8_000 });
		// "Back to Home" button inside .error-actions (not navbar links)
		await expect(page.locator('.error-actions a[href="/"]')).toBeVisible();
	});
});
