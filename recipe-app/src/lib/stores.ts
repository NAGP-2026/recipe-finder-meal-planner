import { writable, derived, get } from 'svelte/store';
import DOMPurify from 'dompurify';
import type { Recipe, MealPlan, MealSlot } from './types';

// ─── XSS Sanitizer ─────────────────────────────────────────────────────────
// Recipe fields (title, instructions, ingredient names) are plain text — no
// HTML markup is ever intentional. DOMPurify with empty allowlists strips
// ALL tags and attributes, extracting only safe text content.
//
// Replaces the previous hand-rolled regex approach with a battle-tested library.
//
// Result: '<script>alert(1)</script>Pasta'  →  'Pasta'
//         '<img src=x onerror=alert(1)> Mix well.'  →  'Mix well.'
//         '<b>Bold</b> Chicken'  →  'Bold Chicken'
function sanitize(raw: string): string {
	return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
	if (typeof localStorage === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function persist<T>(key: string, store: ReturnType<typeof writable<T>>) {
	if (typeof localStorage !== 'undefined') {
		store.subscribe(val => {
			try {
				localStorage.setItem(key, JSON.stringify(val));
			} catch { /* */ }
		});
	}
}

// ─── Favorites ─────────────────────────────────────────────────────────────
export const favorites = writable<Recipe[]>(loadFromStorage<Recipe[]>('rf_favorites', []));
persist('rf_favorites', favorites);

export function addFavorite(recipe: Recipe) {
	favorites.update(faves => {
		if (faves.find(f => f.id === recipe.id)) return faves;
		return [...faves, recipe];
	});
}

export function removeFavorite(id: string) {
	favorites.update(faves => faves.filter(f => f.id !== id));
}

export function isFavorite(id: string): boolean {
	const faves = get(favorites);
	return faves.some(f => f.id === id);
}

export const favoriteIds = derived(favorites, $faves => new Set($faves.map(f => f.id)));

// ─── User Recipes ───────────────────────────────────────────────────────────
export const userRecipes = writable<Recipe[]>(loadFromStorage<Recipe[]>('rf_user_recipes', []));
persist('rf_user_recipes', userRecipes);

function sanitizeRecipe(recipe: Recipe): Recipe {
	return {
		...recipe,
		title: sanitize(recipe.title),
		instructions: sanitize(recipe.instructions),
		ingredients: recipe.ingredients.map(ing => ({
			name: sanitize(ing.name),
			measure: sanitize(ing.measure),
		})),
	};
}

export function addUserRecipe(recipe: Recipe) {
	userRecipes.update(recipes => [sanitizeRecipe(recipe), ...recipes]);
}

export function updateUserRecipe(recipe: Recipe) {
	const clean = sanitizeRecipe(recipe);
	userRecipes.update(recipes => recipes.map(r => r.id === clean.id ? clean : r));
}

export function deleteUserRecipe(id: string) {
	userRecipes.update(recipes => recipes.filter(r => r.id !== id));
	// Also remove from favorites
	removeFavorite(id);
}

// ─── Meal Plan ──────────────────────────────────────────────────────────────
const defaultMealPlan: MealPlan = {};
export const mealPlan = writable<MealPlan>(loadFromStorage<MealPlan>('rf_meal_plan', defaultMealPlan));
persist('rf_meal_plan', mealPlan);

export function addToMealPlan(day: string, mealType: string, slot: MealSlot) {
	mealPlan.update(plan => ({
		...plan,
		[day]: {
			...(plan[day] || {}),
			[mealType]: slot,
		},
	}));
}

export function removeFromMealPlan(day: string, mealType: string) {
	mealPlan.update(plan => {
		const dayPlan = { ...(plan[day] || {}) };
		delete dayPlan[mealType];
		return { ...plan, [day]: dayPlan };
	});
}

export function clearMealPlan() {
	mealPlan.set({});
}

// ─── Ratings ────────────────────────────────────────────────────────────────
export const ratings = writable<Record<string, number>>(loadFromStorage('rf_ratings', {}));
persist('rf_ratings', ratings);

export function setRating(recipeId: string, rating: number) {
	ratings.update(r => ({ ...r, [recipeId]: rating }));
}

// ─── Toast Notifications ─────────────────────────────────────────────────────
export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
}

export const toasts = writable<Toast[]>([]);

// Tracks pending auto-dismiss timers so we can clearTimeout on explicit dismiss.
// Without this, dismissing a toast early left a dangling setTimeout that would
// fire against a stale store reference — a classic memory/timer leak.
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function showToast(message: string, type: Toast['type'] = 'success') {
	const id = Date.now().toString();
	toasts.update(t => [...t, { id, message, type }]);
	const timer = setTimeout(() => dismissToast(id), 3000);
	toastTimers.set(id, timer);
}

export function dismissToast(id: string) {
	const timer = toastTimers.get(id);
	if (timer !== undefined) {
		clearTimeout(timer);
		toastTimers.delete(id);
	}
	toasts.update(t => t.filter(toast => toast.id !== id));
}
