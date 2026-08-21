import type { Recipe, Ingredient } from './types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// ─── Pagination ───────────────────────────────────────────────────────────────
// Shared page size used by all recipe grid pages and tests.
export const PAGE_SIZE = 12;

// ─── Token-Bucket Rate Limiter ────────────────────────────────────────────────
// Prevents rapid successive API calls from hammering TheMealDB.
// Capacity : 5 tokens (burst of 5 simultaneous requests is fine)
// Refill   : 1 token every 200 ms  → max sustained rate of 5 req/sec
// On exhaustion: returns false → callers return [] immediately without fetching.
// Cache hits are NOT subject to rate limiting (checked before this gate).
const _rateBucket = {
	tokens: 5,
	max: 5,
	lastRefill: Date.now(),
	refillIntervalMs: 200,
};

export function checkRateLimit(): boolean {
	const now = Date.now();
	const tokensToAdd = Math.floor((now - _rateBucket.lastRefill) / _rateBucket.refillIntervalMs);
	if (tokensToAdd > 0) {
		_rateBucket.tokens = Math.min(_rateBucket.max, _rateBucket.tokens + tokensToAdd);
		_rateBucket.lastRefill = now;
	}
	if (_rateBucket.tokens <= 0) return false;
	_rateBucket.tokens -= 1;
	return true;
}

/** Reset bucket to full — call from tests only. */
export function _resetRateLimit(): void {
	_rateBucket.tokens = _rateBucket.max;
	_rateBucket.lastRefill = Date.now();
}

// ─── In-memory cache with TTL + LRU eviction ─────────────────────────────────
// Avoids redundant API requests within the same session (categories, areas, searches).
// Capped at MAX_CACHE entries — evicts the oldest entry (insertion order) on overflow
// so the Map never grows unboundedly during long sessions.
const memCache = new Map<string, { data: unknown; ts: number }>();
const TTL_SHORT  = 3 * 60 * 1000;   // 3 min  — random recipes (refreshes if stale)
const TTL_LONG   = 30 * 60 * 1000;  // 30 min — stable data like categories & areas
const MAX_CACHE  = 100;              // O(1) space bound — LRU evicts oldest on overflow

function getCached<T>(key: string, ttl: number): T | null {
	const entry = memCache.get(key);
	if (entry && Date.now() - entry.ts < ttl) return entry.data as T;
	return null;
}
function setCached<T>(key: string, data: T): void {
	// LRU eviction: Map preserves insertion order, so .keys().next() is the oldest entry
	if (memCache.size >= MAX_CACHE) {
		const oldestKey = memCache.keys().next().value;
		if (oldestKey !== undefined) memCache.delete(oldestKey);
	}
	memCache.set(key, { data, ts: Date.now() });
}

// ─── Parser ──────────────────────────────────────────────────────────────────
// Pre-built once at module load — eliminates repeated string concatenation on every
// parseMealToRecipe call (O(1) access vs O(20) string builds per meal object).
const INGREDIENT_KEYS: [string, string][] = Array.from(
	{ length: 20 },
	(_, i) => [`strIngredient${i + 1}`, `strMeasure${i + 1}`]
);

function parseMealToRecipe(meal: Record<string, string>): Recipe {
	const ingredients: Ingredient[] = [];
	for (const [ingKey, measKey] of INGREDIENT_KEYS) {
		const ingredient = meal[ingKey];
		const measure = meal[measKey];
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

// ─── Fetch with timeout & retry ───────────────────────────────────────────────
async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, { signal: controller.signal });
		clearTimeout(id);
		return res;
	} catch (e) {
		clearTimeout(id);
		throw e;
	}
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function searchRecipes(query: string): Promise<Recipe[]> {
	if (!query.trim()) return getRandomRecipes();
	const key = `search:${query.toLowerCase()}`;
	const cached = getCached<Recipe[]>(key, TTL_SHORT);
	if (cached) return cached;
	if (!checkRateLimit()) return []; // rate limited — caller gets graceful empty result
	try {
		const res = await fetchWithTimeout(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
		const data = await res.json();
		const result = (data.meals || []).map(parseMealToRecipe);
		setCached(key, result);
		return result;
	} catch {
		return [];
	}
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
	const key = `recipe:${id}`;
	const cached = getCached<Recipe>(key, TTL_LONG);
	if (cached) return cached;
	if (!checkRateLimit()) return null;
	try {
		const res = await fetchWithTimeout(`${BASE_URL}/lookup.php?i=${id}`);
		const data = await res.json();
		if (!data.meals || data.meals.length === 0) return null;
		const result = parseMealToRecipe(data.meals[0]);
		setCached(key, result);
		return result;
	} catch {
		return null;
	}
}

export async function getRandomRecipes(count: number = 12): Promise<Recipe[]> {
	const key = `random:${count}`;
	const cached = getCached<Recipe[]>(key, TTL_SHORT);
	if (cached) return cached;
	if (!checkRateLimit()) return [];
	try {
		// Instead of N individual /random.php calls (N round trips),
		// fetch 2 letters in parallel — each returns ~10-30 meals in a SINGLE request.
		// This reduces 12 HTTP calls to just 2, cutting load time dramatically.
		// Randomly pick 2 letters for variety on each cache miss.
		const allLetters = ['a','b','c','d','e','f','g','h','k','l','m','n','p','r','s','t','v','w'];
		const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);
		const letters = shuffledLetters.slice(0, 2);
		const responses = await Promise.all(
			letters.map(l => fetchWithTimeout(`${BASE_URL}/search.php?f=${l}`).then(r => r.json()))
		);
		let pool: Recipe[] = responses
			.flatMap(r => (r.meals || []).map(parseMealToRecipe));

		// Shuffle for variety and trim to requested count
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		const result = pool.slice(0, count);
		setCached(key, result);
		return result;
	} catch {
		// Graceful fallback: single /random.php call
		try {
			const res = await fetchWithTimeout(`${BASE_URL}/random.php`);
			const data = await res.json();
			return (data.meals || []).map(parseMealToRecipe);
		} catch { return []; }
	}
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
	const key = `cat:${category}`;
	const cached = getCached<Recipe[]>(key, TTL_LONG);
	if (cached) return cached;
	if (!checkRateLimit()) return [];
	try {
		const res = await fetchWithTimeout(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
		const data = await res.json();
		const result = (data.meals || []).map((m: Record<string, string>) => ({
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
		setCached(key, result);
		return result;
	} catch {
		return [];
	}
}

export async function getRecipesByArea(area: string): Promise<Recipe[]> {
	const key = `area:${area}`;
	const cached = getCached<Recipe[]>(key, TTL_LONG);
	if (cached) return cached;
	if (!checkRateLimit()) return [];
	try {
		const res = await fetchWithTimeout(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
		const data = await res.json();
		const result = (data.meals || []).map((m: Record<string, string>) => ({
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
		setCached(key, result);
		return result;
	} catch {
		return [];
	}
}

export async function getCategories(): Promise<string[]> {
	const key = 'categories';
	const cached = getCached<string[]>(key, TTL_LONG);
	if (cached) return cached;
	try {
		const res = await fetchWithTimeout(`${BASE_URL}/categories.php`);
		const data = await res.json();
		const result = (data.categories || []).map((c: Record<string, string>) => c.strCategory);
		setCached(key, result);
		return result;
	} catch {
		return [];
	}
}

export async function getAreas(): Promise<string[]> {
	const key = 'areas';
	const cached = getCached<string[]>(key, TTL_LONG);
	if (cached) return cached;
	try {
		const res = await fetchWithTimeout(`${BASE_URL}/list.php?a=list`);
		const data = await res.json();
		const result = (data.meals || []).map((m: Record<string, string>) => m.strArea);
		setCached(key, result);
		return result;
	} catch {
		return [];
	}
}

