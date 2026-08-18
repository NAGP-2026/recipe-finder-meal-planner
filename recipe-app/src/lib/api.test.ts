import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchRecipes, getRecipeById, getCategories, getAreas, getRecipesByCategory } from './api';

const mockMeal = {
	idMeal: '52772', strMeal: 'Teriyaki Chicken',
	strMealThumb: 'https://example.com/chicken.jpg',
	strCategory: 'Chicken', strArea: 'Japanese',
	strInstructions: 'Marinate and grill.',
	strTags: 'Chicken,Japanese', strYoutube: 'https://youtube.com/abc',
	strSource: 'https://source.com',
	strIngredient1: 'Chicken', strMeasure1: '500g',
	strIngredient2: 'Soy Sauce', strMeasure2: '3 tbsp',
	strIngredient3: '', strMeasure3: '',
};

function makeFetch(data: unknown) {
	return vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) });
}

afterEach(() => { vi.restoreAllMocks(); });

// ── searchRecipes ─────────────────────────────────────────────────────────────
describe('searchRecipes', () => {
	it('returns parsed recipes', async () => {
		vi.stubGlobal('fetch', makeFetch({ meals: [mockMeal] }));
		const r = await searchRecipes('teriyaki_q1');
		expect(r).toHaveLength(1);
		expect(r[0].id).toBe('52772');
		expect(r[0].title).toBe('Teriyaki Chicken');
		expect(r[0].isUserCreated).toBe(false);
	});

	it('parses ingredients (skips empty slots)', async () => {
		vi.stubGlobal('fetch', makeFetch({ meals: [mockMeal] }));
		const r = await searchRecipes('teriyaki_q2');
		expect(r[0].ingredients).toHaveLength(2);
		expect(r[0].ingredients[0]).toEqual({ name: 'Chicken', measure: '500g' });
	});

	it('parses tags correctly', async () => {
		vi.stubGlobal('fetch', makeFetch({ meals: [mockMeal] }));
		const r = await searchRecipes('teriyaki_q3');
		expect(r[0].tags).toEqual(['Chicken', 'Japanese']);
	});

	it('returns [] when API returns null', async () => {
		vi.stubGlobal('fetch', makeFetch({ meals: null }));
		expect(await searchRecipes('xyz_q4')).toEqual([]);
	});

	it('returns [] on network error', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')));
		expect(await searchRecipes('error_q5')).toEqual([]);
	});
});

// ── getRecipeById ─────────────────────────────────────────────────────────────
describe('getRecipeById', () => {
	it('returns a full recipe', async () => {
		vi.stubGlobal('fetch', makeFetch({ meals: [mockMeal] }));
		const r = await getRecipeById('id_u999');
		expect(r).not.toBeNull();
		expect(r!.title).toBe('Teriyaki Chicken');
		expect(r!.youtube).toBe('https://youtube.com/abc');
	});

	it('returns null when not found', async () => {
		vi.stubGlobal('fetch', makeFetch({ meals: null }));
		expect(await getRecipeById('id_nf1')).toBeNull();
	});

	it('returns null on error', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')));
		expect(await getRecipeById('id_err2')).toBeNull();
	});
});

// ── getCategories — uses fixed cache key; just assert shape ───────────────────
describe('getCategories', () => {
	it('returns an array', async () => {
		const cats = await getCategories();
		expect(Array.isArray(cats)).toBe(true);
	});
});

// ── getAreas — uses fixed cache key; just assert shape ───────────────────────
describe('getAreas', () => {
	it('returns an array', async () => {
		const areas = await getAreas();
		expect(Array.isArray(areas)).toBe(true);
	});
});

// ── getRecipesByCategory ──────────────────────────────────────────────────────
describe('getRecipesByCategory', () => {
	it('returns recipes with category set', async () => {
		vi.stubGlobal('fetch', makeFetch({
			meals: [{ idMeal: '1', strMeal: 'Curry', strMealThumb: 'img.jpg' }],
		}));
		const r = await getRecipesByCategory('Chicken_cx1');
		expect(r).toHaveLength(1);
		expect(r[0].category).toBe('Chicken_cx1');
	});

	it('returns [] on error', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')));
		expect(await getRecipesByCategory('err_cat')).toEqual([]);
	});
});

// ── LRU cache eviction (MAX_CACHE = 100) ────────────────────────────────────
// Verifies the space-complexity fix: memCache is capped at 100 entries.
// Oldest entry (insertion order) must be evicted when the 101st entry is added.
describe('LRU cache eviction', () => {
	it('evicts the oldest cache entry after 100+ unique entries are stored', async () => {
		// Use a highly unique prefix so these keys never collide with other test entries
		const FIRST_KEY = 'lru_evict_anchor_00000';

		// 1. Store the "anchor" entry first — it will become the oldest
		vi.stubGlobal('fetch', makeFetch({ meals: [] }));
		await getRecipesByCategory(FIRST_KEY);

		// 2. Flood with 110 more unique entries to guarantee overflow past MAX_CACHE (100)
		for (let i = 1; i <= 110; i++) {
			vi.stubGlobal('fetch', makeFetch({ meals: [] }));
			await getRecipesByCategory(`lru_evict_flood_${i}`);
		}

		// 3. FIRST_KEY should now be evicted — re-requesting it must call the network
		const networkSpy = makeFetch({ meals: [] });
		vi.stubGlobal('fetch', networkSpy);
		await getRecipesByCategory(FIRST_KEY);
		expect(networkSpy).toHaveBeenCalledTimes(1); // cache miss → network call
	});
});

// ── Pre-built INGREDIENT_KEYS — all 20 slots parsed correctly ────────────────
// Verifies the O(1) key-array optimisation: parseMealToRecipe correctly picks up
// all 20 ingredient/measure pairs without missing or duplicating any slot.
describe('INGREDIENT_KEYS pre-build correctness', () => {
	it('parses all 20 ingredient slots via the pre-built key array', async () => {
		// Build a meal with all 20 ingredient slots filled
		const fullMeal: Record<string, string> = {
			idMeal: 'full20', strMeal: 'Full Recipe', strMealThumb: '',
			strCategory: 'Test', strArea: 'Test', strInstructions: 'Cook it.',
			strTags: '', strYoutube: '', strSource: '',
		};
		for (let i = 1; i <= 20; i++) {
			fullMeal[`strIngredient${i}`] = `Ingredient ${i}`;
			fullMeal[`strMeasure${i}`] = `${i} tbsp`;
		}

		vi.stubGlobal('fetch', makeFetch({ meals: [fullMeal] }));
		const r = await searchRecipes('full20_ingredient_test_unique');
		expect(r[0].ingredients).toHaveLength(20);
		expect(r[0].ingredients[0]).toEqual({ name: 'Ingredient 1', measure: '1 tbsp' });
		expect(r[0].ingredients[19]).toEqual({ name: 'Ingredient 20', measure: '20 tbsp' });
	});
});
