import { writable, derived, get } from 'svelte/store';
import type { Recipe, MealPlan, MealSlot } from './types';

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

export function addUserRecipe(recipe: Recipe) {
	userRecipes.update(recipes => [recipe, ...recipes]);
}

export function updateUserRecipe(recipe: Recipe) {
	userRecipes.update(recipes => recipes.map(r => r.id === recipe.id ? recipe : r));
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

export function showToast(message: string, type: Toast['type'] = 'success') {
	const id = Date.now().toString();
	toasts.update(t => [...t, { id, message, type }]);
	setTimeout(() => {
		toasts.update(t => t.filter(toast => toast.id !== id));
	}, 3000);
}
