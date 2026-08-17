<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { userRecipes, favoriteIds, addFavorite, removeFavorite, addToMealPlan, showToast, ratings, setRating } from '$lib/stores';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';

	$: recipeId = $page.params.id;
	$: recipe = $userRecipes.find(r => r.id === recipeId) || null;
	$: isFav = $favoriteIds.has(recipeId);
	$: myRating = $ratings[recipeId] || 0;

	let showMealPicker = false;
	let selectedDay = DAYS_OF_WEEK[0];
	let selectedMealType = MEAL_TYPES[2];

	function toggleFavorite() {
		if (!recipe) return;
		if (isFav) {
			removeFavorite(recipe.id);
			showToast('Removed from favorites');
		} else {
			addFavorite(recipe);
			showToast(`${recipe.title} added to favorites! ❤️`);
		}
	}

	function handleRatingChange(e: CustomEvent<number>) {
		setRating(recipeId, e.detail);
		showToast(`Rated ${e.detail} stars! ⭐`);
	}

	function confirmMealPlan() {
		if (!recipe) return;
		addToMealPlan(selectedDay, selectedMealType, {
			recipeId: recipe.id,
			recipeTitle: recipe.title,
			recipeImage: recipe.image,
		});
		showToast(`${recipe.title} added to ${selectedDay} ${selectedMealType}! 🗓️`);
		showMealPicker = false;
	}
</script>

{#if !recipe}
	<div class="page">
		<div class="empty-state">
			<div class="empty-icon">😕</div>
			<h3>Recipe not found</h3>
			<button class="btn btn-primary" onclick={() => goto('/my-recipes')}>← Back to My Recipes</button>
		</div>
	</div>
{:else}
	<div class="recipe-detail-page">
		<div class="recipe-hero" style="background-image: url({recipe.image})">
			<div class="hero-overlay">
				<div class="hero-nav">
					<button class="back-btn" onclick={() => goto('/my-recipes')}>← My Recipes</button>
					<div class="hero-actions">
					<favorite-button
							recipeId={recipe.id}
							isFavorite={isFav}
							size="large"
							variant="solid"
							onfavoriteToggle={toggleFavorite}
						></favorite-button>
						<button class="action-btn" onclick={() => goto(`/recipes/edit/${recipe?.id}`)}>✏️ Edit</button>
						<button class="meal-btn" onclick={() => showMealPicker = true}>🗓️ Add to Meal Plan</button>
					</div>
				</div>
				<div class="hero-info">
					<div class="tag-row">
						<span class="user-badge">👨‍🍳 My Recipe</span>
						{#if recipe.area}
							<recipe-badge variant="secondary" size="medium">🌍 {recipe.area}</recipe-badge>
						{/if}
					</div>
					<h1 class="recipe-hero-title">{recipe.title}</h1>
					<div class="meta-row">
						{#if recipe.cookTime}<span class="meta-item">⏱️ {recipe.cookTime}</span>{/if}
						{#if recipe.servings}<span class="meta-item">👥 {recipe.servings} servings</span>{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="recipe-content page">
			{#if recipe.description}
				<div class="description-section">
					<p class="description-text">{recipe.description}</p>
				</div>
			{/if}

			<div class="rating-section">
				<span class="rating-label">Your Rating:</span>
			<rating-stars
					rating={myRating}
					max-rating={5}
					size="large"
					onratingChange={handleRatingChange}
				></rating-stars>
			</div>

			<div class="content-grid">
				<div class="ingredients-panel card">
					<div class="card-body">
						<h2 class="panel-title">🛒 Ingredients</h2>
						<ul class="ingredient-list">
							{#each recipe.ingredients as ing}
								<li class="ingredient-item">
									<span class="ingredient-name">{ing.name}</span>
									{#if ing.measure}<span class="ingredient-measure">{ing.measure}</span>{/if}
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<div class="instructions-panel">
					<h2 class="panel-title">📋 Instructions</h2>
					<div class="instructions-content">
						{#each recipe.instructions.split('\n').filter(Boolean) as step, i}
							<div class="instruction-step">
								<div class="step-number">{i + 1}</div>
								<p class="step-text">{step}</p>
							</div>
						{/each}
					</div>

					{#if recipe.tags.length > 0}
						<div class="tags-section">
							<h3>🏷️ Tags</h3>
							<div class="tags-row">
								{#each recipe.tags as tag}
									<recipe-badge variant="default" size="small">{tag}</recipe-badge>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if showMealPicker}
		<div class="modal-backdrop" onclick={() => showMealPicker = false}>
			<div class="meal-picker-modal" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<h3>Add to Meal Plan</h3>
					<button onclick={() => showMealPicker = false} class="modal-close">✕</button>
				</div>
				<div class="modal-body">
					<p class="recipe-name">📖 {recipe.title}</p>
					<div class="picker-group">
						<label>Day</label>
						<div class="day-grid">
							{#each DAYS_OF_WEEK as day}
								<button class="day-btn {selectedDay === day ? 'selected' : ''}" onclick={() => selectedDay = day}>{day.slice(0,3)}</button>
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
					<button class="btn btn-secondary" onclick={() => showMealPicker = false}>Cancel</button>
					<button class="btn btn-primary" onclick={confirmMealPlan}>Add to Plan 🗓️</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.recipe-detail-page { min-height: calc(100vh - 64px); }
	.recipe-hero { height: 440px; background-size: cover; background-position: center; position: relative; }
	.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 24px; }
	.hero-nav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
	.back-btn { background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: 600; }
	.hero-actions { display: flex; gap: 8px; flex-wrap: wrap; }
	.action-btn, .meal-btn { background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 14px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; }
	.hero-info { color: white; }
	.tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
	.user-badge { background: rgba(255,255,255,0.25); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
	.recipe-hero-title { font-size: clamp(22px, 4vw, 40px); font-weight: 800; line-height: 1.2; margin-bottom: 10px; }
	.meta-row { display: flex; gap: 20px; font-size: 14px; opacity: 0.9; }
	.meta-item { display: flex; align-items: center; gap: 6px; }

	.recipe-content { padding-top: 24px; }
	.description-section { background: #f8fafc; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; border-left: 4px solid var(--primary); }
	.description-text { font-size: 15px; color: var(--text); line-height: 1.7; }
	.rating-section { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
	.rating-label { font-size: 15px; font-weight: 600; color: var(--text-muted); }
	.content-grid { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
	.ingredients-panel { position: sticky; top: calc(var(--nav-height) + 16px); }
	.panel-title { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
	.ingredient-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
	.ingredient-item { display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 8px; font-size: 14px; }
	.ingredient-name { font-weight: 500; }
	.ingredient-measure { color: var(--text-muted); font-weight: 600; }
	.instructions-content { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
	.instruction-step { display: flex; gap: 16px; }
	.step-number { min-width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
	.step-text { font-size: 15px; line-height: 1.7; }
	.tags-section h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
	.tags-row { display: flex; flex-wrap: wrap; gap: 8px; }

	.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
	.meal-picker-modal { background: white; border-radius: 20px; width: 100%; max-width: 480px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
	.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
	.modal-header h3 { font-size: 18px; font-weight: 700; }
	.modal-close { background: #f7fafc; border: none; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; }
	.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
	.recipe-name { font-size: 15px; font-weight: 600; background: #f8fafc; padding: 12px; border-radius: 10px; }
	.picker-group { display: flex; flex-direction: column; gap: 10px; }
	.picker-group label { font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
	.day-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
	.day-btn { padding: 8px 4px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; background: #f8fafc; color: var(--text-muted); }
	.day-btn.selected { background: var(--primary); color: white; border-color: var(--primary); }
	.meal-type-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
	.meal-type-btn { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; background: #f8fafc; color: var(--text-muted); text-transform: capitalize; }
	.meal-type-btn.selected { background: #f0f4ff; color: var(--primary); border-color: var(--primary); }
	.modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid var(--border); }

	@media (max-width: 768px) {
		.content-grid { grid-template-columns: 1fr; }
		.ingredients-panel { position: static; }
	}
</style>
