<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		favoriteIds, addFavorite, removeFavorite,
		showToast, userRecipes, deleteUserRecipe
	} from '$lib/stores';
	import { searchRecipes, getRandomRecipes, getCategories, getAreas, getRecipesByCategory, getRecipesByArea, PAGE_SIZE } from '$lib/api';
	import type { Recipe, FilterState } from '$lib/types';
	import MealPlanPicker from '$lib/components/MealPlanPicker.svelte';

	let recipes: Recipe[] = [];
	let loading = true;
	let searchQuery = '';
	let categories: string[] = [];
	let areas: string[] = [];
	let filterState: FilterState = { category: '', area: '', sortBy: 'default' };
	let showMealPlanPicker = false;
	let selectedRecipeForMealPlan: Recipe | null = null;

	// ── Pagination ──────────────────────────────────────────────────────────
	// Reset to page 1 whenever the active filter/search changes.
	// We track a key string derived from query + filter state; when it changes
	// (new search or filter applied) currentPage snaps back to 1 automatically.
	let currentPage = 1;
	let _prevKey = '';
	$: {
		const key = `${searchQuery}|${filterState.category}|${filterState.area}|${filterState.sortBy}`;
		if (key !== _prevKey) { _prevKey = key; currentPage = 1; }
	}
	$: totalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
	$: pagedRecipes = filteredRecipes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

	function closePicker() {
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
			<!-- Holographic scan line that sweeps left→right across the bar -->
			<div class="search-scan" aria-hidden="true"></div>
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

	<!-- Bottom-left scroll indicator — 3 downward chevrons, orange→purple→teal cascade -->
	<a href="#browse-section" class="scroll-bl" aria-label="Scroll down">
		<span class="chev-d d1"></span>
		<span class="chev-d d2"></span>
		<span class="chev-d d3"></span>
	</a>

	<!-- Bottom-right scroll indicator — mirrored cascade teal→purple→orange -->
	<a href="#browse-section" class="scroll-br" aria-label="Scroll down">
		<span class="chev-d d1"></span>
		<span class="chev-d d2"></span>
		<span class="chev-d d3"></span>
	</a>
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
					<span class="results-count">{filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}{totalPages > 1 ? ` · page ${currentPage}/${totalPages}` : ''}</span>
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
					{#each pagedRecipes as recipe (recipe.id)}
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
				{#if totalPages > 1}
					<div class="pagination">
						<button class="page-btn" onclick={() => currentPage--} disabled={currentPage === 1}>← Prev</button>
						<span class="page-info">Page {currentPage} of {totalPages}</span>
						<button class="page-btn" onclick={() => currentPage++} disabled={currentPage === totalPages}>Next →</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<MealPlanPicker show={showMealPlanPicker} recipe={selectedRecipeForMealPlan} onclose={closePicker} />
