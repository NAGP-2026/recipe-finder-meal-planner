import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { get } from 'svelte/store';
import {
	favorites, favoriteIds, addFavorite, removeFavorite, isFavorite,
	userRecipes, addUserRecipe, updateUserRecipe, deleteUserRecipe,
	mealPlan, addToMealPlan, removeFromMealPlan, clearMealPlan,
	ratings, setRating,
	toasts, showToast, dismissToast,
} from './stores';
import type { Recipe } from './types';

// ── Helper ──────────────────────────────────────────────────────────────────
function mockRecipe(id: string, title = 'Test Recipe'): Recipe {
	return {
		id,
		title,
		image: 'https://example.com/img.jpg',
		category: 'Test',
		area: 'TestLand',
		instructions: 'Cook it.',
		ingredients: [{ name: 'Salt', measure: '1 tsp' }],
		tags: ['test'],
		isUserCreated: false,
	};
}

// ── Favorites ────────────────────────────────────────────────────────────────
describe('Favorites store', () => {
	beforeEach(() => {
		favorites.set([]);
	});

	it('starts empty after reset', () => {
		expect(get(favorites)).toHaveLength(0);
	});

	it('addFavorite — adds a recipe', () => {
		addFavorite(mockRecipe('1', 'Pasta'));
		expect(get(favorites)).toHaveLength(1);
		expect(get(favorites)[0].id).toBe('1');
	});

	it('addFavorite — does not add duplicate ids', () => {
		addFavorite(mockRecipe('1'));
		addFavorite(mockRecipe('1'));
		expect(get(favorites)).toHaveLength(1);
	});

	it('addFavorite — can add multiple different recipes', () => {
		addFavorite(mockRecipe('1'));
		addFavorite(mockRecipe('2'));
		addFavorite(mockRecipe('3'));
		expect(get(favorites)).toHaveLength(3);
	});

	it('removeFavorite — removes the correct recipe', () => {
		addFavorite(mockRecipe('1'));
		addFavorite(mockRecipe('2'));
		removeFavorite('1');
		const ids = get(favorites).map(r => r.id);
		expect(ids).not.toContain('1');
		expect(ids).toContain('2');
	});

	it('removeFavorite — does nothing for unknown id', () => {
		addFavorite(mockRecipe('1'));
		removeFavorite('unknown');
		expect(get(favorites)).toHaveLength(1);
	});

	it('isFavorite — returns true for saved recipe', () => {
		addFavorite(mockRecipe('42'));
		expect(isFavorite('42')).toBe(true);
	});

	it('isFavorite — returns false for unsaved recipe', () => {
		expect(isFavorite('not-saved')).toBe(false);
	});

	it('favoriteIds derived store — contains all ids', () => {
		addFavorite(mockRecipe('a'));
		addFavorite(mockRecipe('b'));
		const ids = get(favoriteIds);
		expect(ids.has('a')).toBe(true);
		expect(ids.has('b')).toBe(true);
		expect(ids.has('c')).toBe(false);
	});
});

// ── User Recipes ─────────────────────────────────────────────────────────────
describe('User Recipes store', () => {
	beforeEach(() => {
		userRecipes.set([]);
		favorites.set([]);
	});

	it('addUserRecipe — prepends new recipe', () => {
		addUserRecipe(mockRecipe('1', 'First'));
		addUserRecipe(mockRecipe('2', 'Second'));
		expect(get(userRecipes)[0].id).toBe('2');
	});

	it('updateUserRecipe — updates title in place', () => {
		addUserRecipe(mockRecipe('1', 'Original'));
		updateUserRecipe({ ...mockRecipe('1'), title: 'Updated Title' });
		expect(get(userRecipes)[0].title).toBe('Updated Title');
	});

	it('updateUserRecipe — only changes matching recipe', () => {
		addUserRecipe(mockRecipe('1', 'First'));
		addUserRecipe(mockRecipe('2', 'Second'));
		updateUserRecipe({ ...mockRecipe('1'), title: 'New First' });
		expect(get(userRecipes).find(r => r.id === '2')?.title).toBe('Second');
	});

	it('deleteUserRecipe — removes recipe', () => {
		addUserRecipe(mockRecipe('1'));
		deleteUserRecipe('1');
		expect(get(userRecipes)).toHaveLength(0);
	});

	it('deleteUserRecipe — also removes from favorites', () => {
		addFavorite(mockRecipe('1'));
		addUserRecipe(mockRecipe('1'));
		deleteUserRecipe('1');
		expect(isFavorite('1')).toBe(false);
	});
});

// ── Meal Plan ─────────────────────────────────────────────────────────────────
describe('Meal Plan store', () => {
	beforeEach(() => {
		mealPlan.set({});
	});

	it('addToMealPlan — creates day/type slot', () => {
		addToMealPlan('Monday', 'dinner', { recipeId: '1', recipeTitle: 'Pasta', recipeImage: '' });
		expect(get(mealPlan)['Monday']['dinner'].recipeId).toBe('1');
	});

	it('addToMealPlan — overwrites existing slot', () => {
		addToMealPlan('Monday', 'dinner', { recipeId: '1', recipeTitle: 'Pasta', recipeImage: '' });
		addToMealPlan('Monday', 'dinner', { recipeId: '2', recipeTitle: 'Pizza', recipeImage: '' });
		expect(get(mealPlan)['Monday']['dinner'].recipeId).toBe('2');
	});

	it('addToMealPlan — different days coexist', () => {
		addToMealPlan('Monday', 'dinner', { recipeId: '1', recipeTitle: 'Pasta', recipeImage: '' });
		addToMealPlan('Tuesday', 'lunch', { recipeId: '2', recipeTitle: 'Salad', recipeImage: '' });
		expect(get(mealPlan)['Monday']['dinner'].recipeId).toBe('1');
		expect(get(mealPlan)['Tuesday']['lunch'].recipeId).toBe('2');
	});

	it('removeFromMealPlan — removes correct slot', () => {
		addToMealPlan('Monday', 'dinner', { recipeId: '1', recipeTitle: 'Pasta', recipeImage: '' });
		removeFromMealPlan('Monday', 'dinner');
		expect(get(mealPlan)['Monday']['dinner']).toBeUndefined();
	});

	it('clearMealPlan — empties entire plan', () => {
		addToMealPlan('Monday', 'dinner', { recipeId: '1', recipeTitle: 'Pasta', recipeImage: '' });
		addToMealPlan('Sunday', 'breakfast', { recipeId: '2', recipeTitle: 'Eggs', recipeImage: '' });
		clearMealPlan();
		expect(get(mealPlan)).toEqual({});
	});
});

// ── Ratings ───────────────────────────────────────────────────────────────────
describe('Ratings store', () => {
	beforeEach(() => {
		ratings.set({});
	});

	it('setRating — saves rating for recipe', () => {
		setRating('recipe1', 4);
		expect(get(ratings)['recipe1']).toBe(4);
	});

	it('setRating — overwrites previous rating', () => {
		setRating('recipe1', 3);
		setRating('recipe1', 5);
		expect(get(ratings)['recipe1']).toBe(5);
	});

	it('setRating — independent ratings per recipe', () => {
		setRating('r1', 5);
		setRating('r2', 2);
		expect(get(ratings)['r1']).toBe(5);
		expect(get(ratings)['r2']).toBe(2);
	});
});

// ── Toast Notifications ───────────────────────────────────────────────────────
describe('Toast notifications', () => {
	beforeEach(() => {
		toasts.set([]);
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('showToast — adds a toast message', () => {
		showToast('Recipe saved!');
		expect(get(toasts)).toHaveLength(1);
		expect(get(toasts)[0].message).toBe('Recipe saved!');
		expect(get(toasts)[0].type).toBe('success');
	});

	it('showToast — uses specified type', () => {
		showToast('Something went wrong', 'error');
		expect(get(toasts)[0].type).toBe('error');
	});

	it('showToast — auto-removes after 3 seconds', () => {
		showToast('Temporary message');
		expect(get(toasts)).toHaveLength(1);
		vi.advanceTimersByTime(3001);
		expect(get(toasts)).toHaveLength(0);
	});

	it('dismissToast — removes toast immediately without waiting 3 s', () => {
		showToast('Dismiss me');
		const id = get(toasts)[0].id;
		dismissToast(id);
		expect(get(toasts)).toHaveLength(0);
		// Advancing time must not re-add or error — timer was cleared
		vi.advanceTimersByTime(3001);
		expect(get(toasts)).toHaveLength(0);
	});
});

// ── XSS Sanitization (DOMPurify) ─────────────────────────────────────────────
// Verifies that addUserRecipe / updateUserRecipe strip all HTML/JS before
// the recipe object is written to localStorage.
describe('XSS sanitization on user recipes', () => {
	beforeEach(() => {
		userRecipes.set([]);
	});

	it('addUserRecipe — strips <script> tags from title', () => {
		addUserRecipe({ ...mockRecipe('xss1'), title: '<script>alert(1)</script>Pasta' });
		const saved = get(userRecipes)[0].title;
		expect(saved).not.toContain('<script>');
		expect(saved).toBe('Pasta');
	});

	it('addUserRecipe — strips inline event handlers from instructions', () => {
		addUserRecipe({
			...mockRecipe('xss2'),
			instructions: '<img src=x onerror=alert(1)> Mix well.',
		});
		const saved = get(userRecipes)[0].instructions;
		expect(saved).not.toContain('<img');
		expect(saved).toContain('Mix well.');
	});

	it('updateUserRecipe — sanitizes title on edit', () => {
		addUserRecipe(mockRecipe('xss3'));
		updateUserRecipe({ ...mockRecipe('xss3'), title: '<b>Bold</b> Chicken' });
		const saved = get(userRecipes)[0].title;
		expect(saved).not.toContain('<b>');
		expect(saved).toBe('Bold Chicken');
	});
});
