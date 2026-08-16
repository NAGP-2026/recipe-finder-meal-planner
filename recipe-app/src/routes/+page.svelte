<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		favoriteIds, addFavorite, removeFavorite,
		addToMealPlan, showToast, userRecipes, deleteUserRecipe
	} from '$lib/stores';
	import { searchRecipes, getRandomRecipes, getCategories, getAreas, getRecipesByCategory, getRecipesByArea } from '$lib/api';
	import type { Recipe, FilterState } from '$lib/types';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';

	let recipes: Recipe[] = [];
	let loading = true;
	let searchQuery = '';
	let categories: string[] = [];
	let areas: string[] = [];
	let filterState: FilterState = { category: '', area: '', sortBy: 'default' };
	let showMealPlanPicker = false;
	let selectedRecipeForMealPlan: Recipe | null = null;
	let selectedDay = DAYS_OF_WEEK[0];
	let selectedMealType = MEAL_TYPES[2];

	// Remove Beef from categories
	const EXCLUDED_CATEGORIES = ['Beef'];

	const categoryEmojis: Record<string, string> = {
		'Chicken': '🍗', 'Dessert': '🍰', 'Lamb': '🍖',
		'Miscellaneous': '🍴', 'Pasta': '🍝', 'Pork': '🥓', 'Seafood': '🦐',
		'Side': '🥗', 'Starter': '🥙', 'Vegan': '🌱', 'Vegetarian': '🥦',
		'Breakfast': '🥞', 'Goat': '🐐',
	};

	const floatingFoods = ['🍕', '🍜', '🥗', '🍱', '🌮', '🍰', '🍛', '🥘'];

	const quickSearches = [
		{ label: '🍝 Pasta', q: 'Pasta' },
		{ label: '🍣 Sushi', q: 'Sushi' },
		{ label: '🌮 Tacos', q: 'Taco' },
		{ label: '🎂 Cake', q: 'Cake' },
		{ label: '🍗 Chicken', q: 'Chicken' },
	];

	$: filteredCategories = categories.filter(c => !EXCLUDED_CATEGORIES.includes(c));
	$: categoriesJson = JSON.stringify(filteredCategories.map(c => ({ value: c, label: c })));
	$: areasJson = JSON.stringify(areas.map(a => ({ value: a, label: a })));

	$: filteredRecipes = (() => {
		// Exclude beef recipes from all views
		const EXCLUDE_TERMS = ['beef'];
		let result = [...recipes, ...$userRecipes].filter(r => {
			const title = r.title.toLowerCase();
			const cat = (r.category || '').toLowerCase();
			return !EXCLUDE_TERMS.some(term => title.includes(term) || cat.includes(term));
		});
		const seen = new Set<string>();
		result = result.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
		if (filterState.sortBy === 'name-asc') result.sort((a, b) => a.title.localeCompare(b.title));
		else if (filterState.sortBy === 'name-desc') result.sort((a, b) => b.title.localeCompare(a.title));
		return result;
	})();

	$: activeTitle = searchQuery
		? `Results for "${searchQuery}"`
		: filterState.category ? `${filterState.category} Recipes`
		: filterState.area ? `${filterState.area} Cuisine`
		: 'Featured Recipes';

	onMount(async () => {
		loading = true;
		const [cats, areasData, initialRecipes] = await Promise.all([
			getCategories(), getAreas(), getRandomRecipes(12)
		]);
		categories = cats.filter(c => !EXCLUDED_CATEGORIES.includes(c));
		areas = areasData;
		recipes = initialRecipes;
		loading = false;
	});

	async function handleSearch(e: CustomEvent<string>) {
		const q = e.detail?.trim();
		if (!q) return;
		searchQuery = q;
		loading = true;
		filterState = { category: '', area: '', sortBy: filterState.sortBy };
		recipes = await searchRecipes(q);
		loading = false;
		document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' });
	}

	async function handleSearchClear() {
		searchQuery = '';
		filterState = { category: '', area: '', sortBy: filterState.sortBy };
		loading = true;
		recipes = await getRandomRecipes(12);
		loading = false;
	}

	async function handleFilterChange(e: CustomEvent<FilterState>) {
		const { category, area, sortBy } = e.detail;
		const prev = filterState;
		filterState = { category, area, sortBy };
		loading = true;
		if (category && category !== prev.category) recipes = await getRecipesByCategory(category);
		else if (area && area !== prev.area) recipes = await getRecipesByArea(area);
		else if (!category && !area) recipes = searchQuery ? await searchRecipes(searchQuery) : await getRandomRecipes(12);
		loading = false;
	}

	async function handleFilterReset() {
		filterState = { category: '', area: '', sortBy: 'default' };
		loading = true;
		recipes = await getRandomRecipes(12);
		loading = false;
	}

	async function quickFilter(cat: string) {
		if (filterState.category === cat) { await handleFilterReset(); return; }
		filterState = { ...filterState, category: cat };
		loading = true;
		recipes = await getRecipesByCategory(cat);
		loading = false;
		document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' });
	}

	function handleCardClick(e: CustomEvent<string>) {
		const id = e.detail;
		goto($userRecipes.find(r => r.id === id) ? `/recipes/user/${id}` : `/recipes/${id}`);
	}

	function handleFavoriteToggle(e: CustomEvent<{ id: string; isFavorite: boolean }>) {
		const { id, isFavorite } = e.detail;
		const recipe = filteredRecipes.find(r => r.id === id);
		if (!recipe) return;
		if (isFavorite) { addFavorite(recipe); showToast(`Added to favorites! ❤️`); }
		else { removeFavorite(id); showToast(`Removed from favorites`); }
	}

	function handleAddToMealPlan(e: CustomEvent<string>) {
		selectedRecipeForMealPlan = filteredRecipes.find(r => r.id === e.detail) || null;
		if (selectedRecipeForMealPlan) showMealPlanPicker = true;
	}

	function confirmMealPlan() {
		if (!selectedRecipeForMealPlan) return;
		addToMealPlan(selectedDay, selectedMealType, {
			recipeId: selectedRecipeForMealPlan.id,
			recipeTitle: selectedRecipeForMealPlan.title,
			recipeImage: selectedRecipeForMealPlan.image,
		});
		showToast(`Added to ${selectedDay} ${selectedMealType}! 📅`);
		showMealPlanPicker = false;
		selectedRecipeForMealPlan = null;
	}

	function handleEditRecipe(e: CustomEvent<string>) { goto(`/recipes/edit/${e.detail}`); }
	function handleDeleteRecipe(e: CustomEvent<string>) { deleteUserRecipe(e.detail); showToast('Recipe deleted'); }
</script>

<!-- ══════════ HERO ══════════════════════════════════════════ -->
<section class="hero">
	<div class="hero-bg">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>
		<div class="orb orb-4"></div>
	</div>

	<!-- Floating food particles -->
	{#each floatingFoods as food, i}
		<div class="food-float f{i + 1}">{food}</div>
	{/each}

	<div class="hero-content">
		<div class="hero-badge">
			<span class="hero-badge-dot"></span>
			Free forever · 10,000+ Recipes · 50+ World Cuisines
		</div>

		<h1 class="hero-title">
			Cook Something<br>
			<span class="gradient-text">Extraordinary</span>
			<span class="italic-block">every single day</span>
		</h1>

		<p class="hero-subtitle">
			Discover world-class recipes, save your favorites, and plan every meal of your week — effortlessly.
		</p>

		<div class="hero-search">
			<search-bar
				placeholder="Search pizza, ramen, desserts..."
				value={searchQuery}
				onsearchSubmit={handleSearch}
				onsearchChange={handleSearch}
				onsearchClear={handleSearchClear}
			></search-bar>
		</div>

		<div class="hero-quick-tags">
			<span class="quick-tag-label">Popular:</span>
			{#each quickSearches as tag}
				<button class="quick-tag" onclick={() => handleSearch({ detail: tag.q } as CustomEvent<string>)}>
					{tag.label}
				</button>
			{/each}
		</div>

		<div class="hero-stats">
			<div class="hero-stat">
				<span class="hero-stat-num">10K+</span>
				<span class="hero-stat-label">Recipes</span>
			</div>
			<div class="hero-stat">
				<span class="hero-stat-num">50+</span>
				<span class="hero-stat-label">Cuisines</span>
			</div>
			<div class="hero-stat">
				<span class="hero-stat-num">100%</span>
				<span class="hero-stat-label">Free</span>
			</div>
		</div>
	</div>

</section>

<!-- Section Divider -->
<div class="section-divider"></div>

<!-- ══════════ CATEGORY PILLS ══════════════════════════════ -->
<div class="page" style="padding-top: 8px; padding-bottom: 0;" id="browse-section">
	<div class="category-bar">
		<div class="category-pills">
			<button
				class="category-pill {!filterState.category ? 'active' : ''}"
				onclick={handleFilterReset}
			><span class="cat-emoji">✨</span> All Recipes</button>
			{#each filteredCategories as cat}
				<button
					class="category-pill {filterState.category === cat ? 'active' : ''}"
					onclick={() => quickFilter(cat)}
				><span class="cat-emoji">{categoryEmojis[cat] || '🍴'}</span>{cat}</button>
			{/each}
		</div>
	</div>
</div>

<!-- ══════════ BROWSE LAYOUT ════════════════════════════════ -->
<div class="page" style="padding-top: 12px;">
	<div class="browse-layout">
		<aside class="filter-sidebar">
			<filter-panel
				categories={categoriesJson}
				areas={areasJson}
				selectedCategory={filterState.category}
				selectedArea={filterState.area}
				sortBy={filterState.sortBy}
				onfilterChange={handleFilterChange}
				onfilterReset={handleFilterReset}
			></filter-panel>
		</aside>

		<div>
			<div class="results-header">
				<h2 class="section-title">{activeTitle}</h2>
				{#if !loading}
					<span class="results-count">{filteredRecipes.length} recipes</span>
				{/if}
			</div>

			{#if loading}
				<div class="loading-wrapper" style="min-height: 480px;">
					<loading-spinner size="large" message="Fetching delicious recipes..."></loading-spinner>
				</div>
			{:else if filteredRecipes.length === 0}
				<div class="empty-state">
					<div class="empty-icon">🔍</div>
					<h3>No recipes found</h3>
					<p>Try a different keyword or reset the filters to explore the full collection</p>
					<button class="btn btn-primary btn-lg" onclick={handleFilterReset}>✨ Browse All Recipes</button>
				</div>
			{:else}
				<div class="recipes-grid">
					{#each filteredRecipes as recipe (recipe.id)}
						<recipe-card
							recipeId={recipe.id}
							recipeTitle={recipe.title}
							image={recipe.image}
							area={recipe.area}
							isFavorite={$favoriteIds.has(recipe.id)}
							isUserCreated={recipe.isUserCreated}
							cookTime={recipe.cookTime || ''}
							servings={recipe.servings || ''}
							oncardClick={handleCardClick}
							onfavoriteToggle={handleFavoriteToggle}
							onaddToMealPlan={handleAddToMealPlan}
							oneditRecipe={handleEditRecipe}
							ondeleteRecipe={handleDeleteRecipe}
						></recipe-card>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- ══════════ MEAL PLAN MODAL ══════════════════════════════ -->
{#if showMealPlanPicker && selectedRecipeForMealPlan}
	<div class="modal-backdrop" role="dialog" aria-modal="true">
		<div class="meal-picker-modal">
			<div class="modal-header">
				<h3>📅 Add to Meal Plan</h3>
				<button class="modal-close" onclick={() => showMealPlanPicker = false}>✕</button>
			</div>
			<div class="modal-body">
				<p class="recipe-name">📖 {selectedRecipeForMealPlan.title}</p>
				<div class="picker-group">
					<label>Day of the Week</label>
					<div class="day-grid">
						{#each DAYS_OF_WEEK as day}
							<button class="day-btn {selectedDay === day ? 'selected' : ''}" onclick={() => selectedDay = day}>
								{day.slice(0, 3)}
							</button>
						{/each}
					</div>
				</div>
				<div class="picker-group">
					<label>Meal Type</label>
					<div class="meal-type-grid">
						{#each MEAL_TYPES as type}
							<button class="meal-type-btn {selectedMealType === type ? 'selected' : ''}" onclick={() => selectedMealType = type}>
								{type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : type === 'dinner' ? '🌙' : '🍎'} {type}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-secondary" onclick={() => showMealPlanPicker = false}>Cancel</button>
				<button class="btn btn-primary" onclick={confirmMealPlan}>Add to Plan 📅</button>
			</div>
		</div>
	</div>
{/if}
