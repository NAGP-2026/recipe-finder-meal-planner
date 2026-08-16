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

<div class="myrecipes-page">
	<!-- Background orbs -->
	<div class="bg-orb bg-orb-1"></div>
	<div class="bg-orb bg-orb-2"></div>
	<div class="bg-orb bg-orb-3"></div>

	<div class="page">
		<!-- Compact banner header -->
		<div class="myrecipes-banner">
			<div class="banner-icon">👨‍🍳</div>
			<div class="banner-text">
				<h1 class="page-title">My Recipes</h1>
				<p class="page-subtitle">Recipes you've created and shared with the world</p>
			</div>
			<div class="banner-actions">
				{#if $userRecipes.length > 0}
					<span class="recipe-count-badge">
						{$userRecipes.length} {$userRecipes.length === 1 ? 'recipe' : 'recipes'}
					</span>
				{/if}
				<a href="/recipes/create" class="btn btn-primary">✨ Create Recipe</a>
			</div>
		</div>

		{#if $userRecipes.length === 0}
			<div class="empty-compact">
				<div class="empty-emoji">📝</div>
				<h3>No recipes created yet</h3>
				<p>Share your culinary creations with the world. Click below to get started!</p>
				<a href="/recipes/create" class="btn btn-primary btn-lg">✨ Create First Recipe</a>
			</div>
		{:else}
			<div class="recipes-grid">
				{#each $userRecipes as recipe (recipe.id)}
					<recipe-card
						recipeId={recipe.id}
						recipeTitle={recipe.title}
						image={recipe.image}
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
</div>

<!-- Meal Plan Modal -->
{#if showMealPlanPicker && selectedRecipe}
	<div class="modal-backdrop" role="dialog" aria-modal="true">
		<div class="meal-picker-modal">
			<div class="modal-header">
				<h3>📅 Add to Meal Plan</h3>
				<button class="modal-close" onclick={() => showMealPlanPicker = false}>✕</button>
			</div>
			<div class="modal-body">
				<p class="recipe-name">📖 {selectedRecipe.title}</p>
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

<style>
	/* ── Orange/gold gradient bg ──────────────── */
	.myrecipes-page {
		position: relative;
		min-height: calc(100vh - 70px);
		background:
			radial-gradient(ellipse 80% 50% at 5% 0%, rgba(255, 107, 53, 0.14) 0%, transparent 55%),
			radial-gradient(ellipse 60% 40% at 95% 5%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse 50% 30% at 50% 100%, rgba(255, 107, 53, 0.06) 0%, transparent 60%),
			#0B0F1E;
		overflow: hidden;
	}

	.bg-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		pointer-events: none;
		z-index: 0;
	}
	.bg-orb-1 {
		width: 600px; height: 600px;
		background: radial-gradient(circle, rgba(255, 107, 53, 0.18), transparent 70%);
		top: -200px; left: -200px;
	}
	.bg-orb-2 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, rgba(245, 158, 11, 0.12), transparent 70%);
		top: 80px; right: -80px;
	}
	.bg-orb-3 {
		width: 300px; height: 300px;
		background: radial-gradient(circle, rgba(255, 107, 53, 0.08), transparent 70%);
		bottom: 20%; left: 45%;
	}

	.myrecipes-page > .page {
		position: relative;
		z-index: 1;
	}

	/* ── Banner ───────────────────────────────── */
	.myrecipes-banner {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
		margin-bottom: 32px;
		padding: 20px 24px;
		background: rgba(255, 107, 53, 0.06);
		border: 1px solid rgba(255, 107, 53, 0.18);
		border-radius: 20px;
		backdrop-filter: blur(10px);
	}

	.banner-icon {
		font-size: 44px;
		filter: drop-shadow(0 4px 14px rgba(255, 107, 53, 0.5));
		flex-shrink: 0;
	}

	.banner-text { flex: 1; }

	.banner-actions {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.recipe-count-badge {
		background: rgba(255, 107, 53, 0.1);
		color: #ff8a5e;
		border: 1px solid rgba(255, 107, 53, 0.25);
		padding: 6px 16px;
		border-radius: 100px;
		font-size: 13px;
		font-weight: 700;
		white-space: nowrap;
	}

	/* ── Compact empty state ──────────────────── */
	.empty-compact {
		text-align: center;
		padding: 48px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
	}

	.empty-emoji {
		font-size: 60px;
		animation: floatEmoji 4s ease-in-out infinite;
		filter: drop-shadow(0 8px 20px rgba(255, 107, 53, 0.35));
	}

	.empty-compact h3 {
		font-size: 24px;
		font-weight: 800;
		color: var(--text);
		font-family: 'Playfair Display', serif;
	}

	.empty-compact p {
		color: var(--text-muted);
		max-width: 360px;
		font-size: 15px;
		line-height: 1.7;
	}

	@keyframes floatEmoji {
		0%, 100% { transform: translateY(0) rotate(-3deg); }
		50% { transform: translateY(-12px) rotate(3deg); }
	}
</style>
