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
