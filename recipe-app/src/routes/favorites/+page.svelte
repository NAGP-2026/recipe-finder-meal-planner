<script lang="ts">
	import { goto } from '$app/navigation';
	import { favorites, favoriteIds, removeFavorite, addToMealPlan, showToast } from '$lib/stores';
	import type { Recipe } from '$lib/types';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';

	let showMealPlanPicker = false;
	let selectedRecipe: Recipe | null = null;
	let selectedDay = DAYS_OF_WEEK[0];
	let selectedMealType = MEAL_TYPES[2];

	function handleCardClick(e: CustomEvent<string>) {
		goto(`/recipes/${e.detail}`);
	}

	function handleFavoriteToggle(e: CustomEvent<{ id: string; isFavorite: boolean }>) {
		const { id, isFavorite } = e.detail;
		if (!isFavorite) {
			const recipe = $favorites.find(r => r.id === id);
			removeFavorite(id);
			showToast(`${recipe?.title} removed from favorites`);
		}
	}

	function handleAddToMealPlan(e: CustomEvent<string>) {
		selectedRecipe = $favorites.find(r => r.id === e.detail) || null;
		if (selectedRecipe) showMealPlanPicker = true;
	}

	function confirmMealPlan() {
		if (!selectedRecipe) return;
		addToMealPlan(selectedDay, selectedMealType, {
			recipeId: selectedRecipe.id,
			recipeTitle: selectedRecipe.title,
			recipeImage: selectedRecipe.image,
		});
		showToast(`Added to ${selectedDay} ${selectedMealType}! 📅`);
		showMealPlanPicker = false;
		selectedRecipe = null;
	}
</script>

<div class="page">
	<div class="fav-header">
		<div>
			<h1 class="page-title">❤️ My Favorites</h1>
			<p class="page-subtitle">Your personally curated recipe collection</p>
		</div>
		{#if $favorites.length > 0}
			<div class="fav-count-badge">
				{$favorites.length} saved {$favorites.length === 1 ? 'recipe' : 'recipes'}
			</div>
		{/if}
	</div>

	{#if $favorites.length === 0}
		<div class="empty-state">
			<div class="empty-icon">💔</div>
			<h3>No favorites yet</h3>
			<p>Tap the heart icon on any recipe to save it here for quick access later</p>
			<a href="/" class="btn btn-primary btn-lg">🔍 Discover Recipes</a>
		</div>
	{:else}
		<div class="recipes-grid">
			{#each $favorites as recipe (recipe.id)}
				<recipe-card
					recipeId={recipe.id}
					recipeTitle={recipe.title}
					image={recipe.image}
					category={recipe.category}
					area={recipe.area}
					isFavorite={true}
					isUserCreated={recipe.isUserCreated}
					cookTime={recipe.cookTime || ''}
					servings={recipe.servings || ''}
					oncardClick={handleCardClick}
					onfavoriteToggle={handleFavoriteToggle}
					onaddToMealPlan={handleAddToMealPlan}
				></recipe-card>
			{/each}
		</div>
	{/if}
</div>

<!-- Meal Plan Modal -->
{#if showMealPlanPicker && selectedRecipe}
	<div class="modal-backdrop" role="dialog" aria-modal="true">
		<div class="meal-picker-modal">
			<div class="modal-header">
				<h3>Add to Meal Plan</h3>
				<button class="modal-close" onclick={() => showMealPlanPicker = false}>✕</button>
			</div>
			<div class="modal-body">
				<p class="recipe-name">📖 {selectedRecipe.title}</p>
				<div class="picker-group">
					<label>Day</label>
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

<style>
	.fav-header {
		display: flex; align-items: flex-start; justify-content: space-between;
		gap: 16px; flex-wrap: wrap; margin-bottom: 36px;
	}
	.fav-count-badge {
		background: rgba(244, 63, 94, 0.12);
		color: #f87171;
		border: 1px solid rgba(244, 63, 94, 0.22);
		padding: 8px 18px; border-radius: 100px;
		font-size: 14px; font-weight: 700;
		align-self: center;
	}
</style>
