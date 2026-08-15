<script lang="ts">
	import { goto } from '$app/navigation';
	import { userRecipes, deleteUserRecipe, addToMealPlan, showToast, favoriteIds } from '$lib/stores';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';
	import type { Recipe } from '$lib/types';

	let showMealPlanPicker = false;
	let selectedRecipe: Recipe | null = null;
	let selectedDay = DAYS_OF_WEEK[0];
	let selectedMealType = MEAL_TYPES[2];

	function handleCardClick(e: CustomEvent<string>) { goto(`/recipes/user/${e.detail}`); }
	function handleEditRecipe(e: CustomEvent<string>) { goto(`/recipes/edit/${e.detail}`); }

	function handleDeleteRecipe(e: CustomEvent<string>) {
		if (confirm('Delete this recipe permanently?')) {
			deleteUserRecipe(e.detail);
			showToast('Recipe deleted');
		}
	}

	function handleAddToMealPlan(e: CustomEvent<string>) {
		selectedRecipe = $userRecipes.find(r => r.id === e.detail) || null;
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
	<div class="my-header">
		<div>
			<h1 class="page-title">👨‍🍳 My Recipes</h1>
			<p class="page-subtitle">Recipes you've created and shared with the world</p>
		</div>
		<a href="/recipes/create" class="btn btn-primary">+ Create Recipe</a>
	</div>

	{#if $userRecipes.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📝</div>
			<h3>No recipes created yet</h3>
			<p>Share your culinary creations with the world! Click the button below to get started</p>
			<a href="/recipes/create" class="btn btn-primary btn-lg">✨ Create First Recipe</a>
		</div>
	{:else}
		<div class="my-recipes-meta">
			<span class="results-count">{$userRecipes.length} {$userRecipes.length === 1 ? 'recipe' : 'recipes'} created</span>
		</div>
		<div class="recipes-grid">
			{#each $userRecipes as recipe (recipe.id)}
				<recipe-card
					recipeId={recipe.id}
					recipeTitle={recipe.title}
					image={recipe.image}
					category={recipe.category}
					area={recipe.area || ''}
					isFavorite={$favoriteIds.has(recipe.id)}
					isUserCreated={true}
					cookTime={recipe.cookTime || ''}
					servings={recipe.servings || ''}
					oncardClick={handleCardClick}
					onfavoriteToggle={() => {}}
					onaddToMealPlan={handleAddToMealPlan}
					oneditRecipe={handleEditRecipe}
					ondeleteRecipe={handleDeleteRecipe}
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
	.my-header {
		display: flex; align-items: flex-start; justify-content: space-between;
		gap: 16px; flex-wrap: wrap; margin-bottom: 32px;
	}
	.my-recipes-meta {
		display: flex; align-items: center; gap: 12px;
		margin-bottom: 20px;
	}
</style>
