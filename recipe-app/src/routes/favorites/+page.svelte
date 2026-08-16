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
		const recipe = $favorites.find(r => r.id === e.detail);
		goto(recipe?.isUserCreated ? `/recipes/user/${e.detail}` : `/recipes/${e.detail}`);
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

<!-- Page wrapper with rose/purple gradient bg -->
<div class="fav-page">
	<!-- Decorative background orbs -->
	<div class="bg-orb bg-orb-1"></div>
	<div class="bg-orb bg-orb-2"></div>
	<div class="bg-orb bg-orb-3"></div>

	<div class="page">
		<!-- Compact header banner -->
		<div class="fav-banner">
			<div class="banner-icon">❤️</div>
			<div class="banner-text">
				<h1 class="page-title">My Favorites</h1>
				<p class="page-subtitle">Your personally curated recipe collection</p>
			</div>
			{#if $favorites.length > 0}
				<div class="fav-count-badge">
					{$favorites.length} {$favorites.length === 1 ? 'recipe' : 'recipes'} saved
				</div>
			{/if}
		</div>

		{#if $favorites.length === 0}
			<div class="empty-state-compact">
				<div class="empty-icon-sm">💔</div>
				<h3>No favorites yet</h3>
				<p>Tap the ❤️ icon on any recipe card to save it here for quick access</p>
				<a href="/" class="btn btn-primary btn-lg">🔍 Discover Recipes</a>
			</div>
		{:else}
			<div class="recipes-grid">
				{#each $favorites as recipe (recipe.id)}
					<recipe-card
						recipeId={recipe.id}
						recipeTitle={recipe.title}
						image={recipe.image}
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
	/* ── Page gradient background ─────────────── */
	.fav-page {
		position: relative;
		min-height: calc(100vh - 70px);
		background:
			radial-gradient(ellipse 80% 50% at 5% 0%, rgba(244, 63, 94, 0.14) 0%, transparent 55%),
			radial-gradient(ellipse 60% 40% at 95% 5%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
			radial-gradient(ellipse 50% 30% at 50% 100%, rgba(244, 63, 94, 0.06) 0%, transparent 60%),
			#0B0F1E;
		overflow: hidden;
	}

	/* Decorative orbs */
	.bg-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		pointer-events: none;
		z-index: 0;
	}
	.bg-orb-1 {
		width: 600px; height: 600px;
		background: radial-gradient(circle, rgba(244, 63, 94, 0.18), transparent 70%);
		top: -200px; left: -200px;
	}
	.bg-orb-2 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, rgba(139, 92, 246, 0.14), transparent 70%);
		top: 100px; right: -100px;
	}
	.bg-orb-3 {
		width: 300px; height: 300px;
		background: radial-gradient(circle, rgba(244, 63, 94, 0.08), transparent 70%);
		bottom: 20%; left: 40%;
	}

	/* Content sits above orbs */
	.fav-page > .page {
		position: relative;
		z-index: 1;
	}

	/* ── Banner ───────────────────────────────── */
	.fav-banner {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
		margin-bottom: 32px;
		padding: 24px 28px;
		background: rgba(244, 63, 94, 0.06);
		border: 1px solid rgba(244, 63, 94, 0.15);
		border-radius: 20px;
		backdrop-filter: blur(10px);
	}

	.banner-icon {
		font-size: 48px;
		filter: drop-shadow(0 4px 16px rgba(244, 63, 94, 0.5));
		flex-shrink: 0;
	}

	.banner-text {
		flex: 1;
	}

	.fav-count-badge {
		background: rgba(244, 63, 94, 0.12);
		color: #f87171;
		border: 1px solid rgba(244, 63, 94, 0.25);
		padding: 8px 20px;
		border-radius: 100px;
		font-size: 14px;
		font-weight: 700;
		white-space: nowrap;
	}

	/* ── Compact empty state ──────────────────── */
	.empty-state-compact {
		text-align: center;
		padding: 48px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
	}

	.empty-icon-sm {
		font-size: 64px;
		animation: floatEmoji 4s ease-in-out infinite;
		filter: drop-shadow(0 8px 24px rgba(244, 63, 94, 0.4));
	}

	.empty-state-compact h3 {
		font-size: 24px;
		font-weight: 800;
		color: var(--text);
		font-family: 'Playfair Display', serif;
	}

	.empty-state-compact p {
		color: var(--text-muted);
		max-width: 360px;
		font-size: 15px;
		line-height: 1.7;
	}

	@keyframes floatEmoji {
		0%, 100% { transform: translateY(0) rotate(-4deg); }
		50% { transform: translateY(-14px) rotate(4deg); }
	}
</style>
