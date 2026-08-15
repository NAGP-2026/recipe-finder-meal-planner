import type { Recipe, Ingredient } from './types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

function parseMealToRecipe(meal: Record<string, string>): Recipe {
	const ingredients: Ingredient[] = [];
	for (let i = 1; i <= 20; i++) {
		const ingredient = meal[`strIngredient${i}`];
		const measure = meal[`strMeasure${i}`];
		if (ingredient && ingredient.trim()) {
			ingredients.push({ name: ingredient.trim(), measure: measure?.trim() || '' });
		}
	}

	return {
		id: meal.idMeal,
		title: meal.strMeal,
		image: meal.strMealThumb,
		category: meal.strCategory || '',
		area: meal.strArea || '',
		instructions: meal.strInstructions || '',
		ingredients,
		tags: meal.strTags ? meal.strTags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
		youtube: meal.strYoutube || '',
		source: meal.strSource || '',
		isUserCreated: false,
	};
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
	if (!query.trim()) return getRandomRecipes();
	try {
		const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
		const data = await res.json();
		return (data.meals || []).map(parseMealToRecipe);
	} catch {
		return [];
	}
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
	try {
		const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
		const data = await res.json();
		if (!data.meals || data.meals.length === 0) return null;
		return parseMealToRecipe(data.meals[0]);
	} catch {
		return null;
	}
}

export async function getRandomRecipes(count: number = 12): Promise<Recipe[]> {
	try {
		const promises = Array.from({ length: count }, () =>
			fetch(`${BASE_URL}/random.php`).then(r => r.json())
		);
		const results = await Promise.all(promises);
		return results
			.filter(r => r.meals && r.meals.length > 0)
			.map(r => parseMealToRecipe(r.meals[0]));
	} catch {
		return [];
	}
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
	try {
		const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
		const data = await res.json();
		return (data.meals || []).map((m: Record<string, string>) => ({
			id: m.idMeal,
			title: m.strMeal,
			image: m.strMealThumb,
			category,
			area: '',
			instructions: '',
			ingredients: [],
			tags: [],
			isUserCreated: false,
		}));
	} catch {
		return [];
	}
}

export async function getRecipesByArea(area: string): Promise<Recipe[]> {
	try {
		const res = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
		const data = await res.json();
		return (data.meals || []).map((m: Record<string, string>) => ({
			id: m.idMeal,
			title: m.strMeal,
			image: m.strMealThumb,
			category: '',
			area,
			instructions: '',
			ingredients: [],
			tags: [],
			isUserCreated: false,
		}));
	} catch {
		return [];
	}
}

export async function getCategories(): Promise<string[]> {
	try {
		const res = await fetch(`${BASE_URL}/categories.php`);
		const data = await res.json();
		return (data.categories || []).map((c: Record<string, string>) => c.strCategory);
	} catch {
		return [];
	}
}

export async function getAreas(): Promise<string[]> {
	try {
		const res = await fetch(`${BASE_URL}/list.php?a=list`);
		const data = await res.json();
		return (data.meals || []).map((m: Record<string, string>) => m.strArea);
	} catch {
		return [];
	}
}

export async function getRecipesByLetter(letter: string): Promise<Recipe[]> {
	try {
		const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
		const data = await res.json();
		return (data.meals || []).map(parseMealToRecipe);
	} catch {
		return [];
	}
}
