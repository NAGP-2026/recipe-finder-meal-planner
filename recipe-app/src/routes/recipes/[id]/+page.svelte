<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { favoriteIds, addFavorite, removeFavorite, addToMealPlan, showToast, ratings, setRating } from '$lib/stores';
	import { getRecipeById } from '$lib/api';
	import type { Recipe } from '$lib/types';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';

	let recipe: Recipe | null = null;
	let loading = true;
	let notFound = false;
	let showMealPicker = false;
	let selectedDay = DAYS_OF_WEEK[0];
	let selectedMealType = MEAL_TYPES[2];

	$: recipeId = $page.params.id;
	$: isFav = $favoriteIds.has(recipeId);
	$: myRating = $ratings[recipeId] || 0;

	onMount(async () => {
		recipe = await getRecipeById(recipeId);
		if (!recipe) notFound = true;
		loading = false;
	});

	function toggleFavorite() {
		if (!recipe) return;
		if (isFav) { removeFavorite(recipe.id); showToast('Removed from favorites'); }
		else { addFavorite(recipe); showToast(`${recipe.title} added to favorites! ❤️`); }
	}

	function handleRatingChange(e: CustomEvent<number>) {
		setRating(recipeId, e.detail);
		showToast(`Rated ${e.detail} star${e.detail !== 1 ? 's' : ''}! ⭐`);
	}

	function confirmMealPlan() {
		if (!recipe) return;
		addToMealPlan(selectedDay, selectedMealType, {
			recipeId: recipe.id,
			recipeTitle: recipe.title,
			recipeImage: recipe.image,
		});
		showToast(`Added to ${selectedDay} ${selectedMealType}! 🗓️`);
		showMealPicker = false;
	}

	function getYoutubeId(url: string): string {
		const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
		return m ? m[1] : '';
	}

	$: steps = recipe?.instructions
		.split(/\r?\n/)
		.map(s => s.trim())
		.filter(s => s.length > 10) ?? [];
</script>

{#if loading}
	<div class="loading-wrapper" style="min-height: 80vh;">
		<loading-spinner size="large" message="Loading recipe..."></loading-spinner>
	</div>
{:else if notFound || !recipe}
	<div class="page">
		<div class="empty-state">
			<div class="empty-icon">😕</div>
			<h3>Recipe not found</h3>
			<p>The recipe you're looking for doesn't exist.</p>
			<button class="btn btn-primary" onclick={() => goto('/')}>← Back to Recipes</button>
		</div>
	</div>
{:else}
	<div class="detail-page">

		<!-- ── HERO ── -->
		<div class="detail-hero" style="background-image: url('{recipe.image}')">
			<div class="hero-glass-overlay"></div>
			<div class="hero-gradient"></div>

			<div class="hero-nav">
				<button class="glass-btn" onclick={() => goto('/')}>
					← Back
				</button>
				<div class="hero-actions">
					<favorite-button
						recipeId={recipe.id}
						isFavorite={isFav}
						size="medium"
						variant="solid"
						onfavoriteToggle={toggleFavorite}
					></favorite-button>
					<button class="glass-btn" onclick={() => showMealPicker = true}>
					🗓️ Meal Plan
					</button>
				</div>
			</div>

			<div class="hero-meta">
				<div class="badge-row">
					{#if recipe.area}
						<recipe-badge variant="secondary" size="medium">🌍 {recipe.area}</recipe-badge>
					{/if}
					{#each recipe.tags.slice(0, 3) as tag}
						<recipe-badge variant="default" size="small">{tag}</recipe-badge>
					{/each}
				</div>
				<h1 class="detail-title">{recipe.title}</h1>
				<div class="detail-meta-row">
					{#if recipe.cookTime}<span class="meta-chip">⏱️ {recipe.cookTime}</span>{/if}
					{#if recipe.servings}<span class="meta-chip">👥 {recipe.servings}</span>{/if}
					<span class="meta-chip">🥘 {recipe.ingredients.length} ingredients</span>
				</div>
			</div>
		</div>

		<!-- ── CONTENT ── -->
		<div class="detail-content page">

			<!-- Rating -->
			<div class="rating-bar">
				<span class="rating-label">Your Rating</span>
				<rating-stars
					rating={myRating}
					max-rating={5}
					size="large"
					onratingChange={handleRatingChange}
				></rating-stars>
				{#if myRating > 0}
					<span class="rating-val">{myRating}/5</span>
				{/if}
			</div>

			<div class="detail-grid">

				<!-- Ingredients Sidebar -->
				<aside class="ingredients-col">
					<div class="detail-card">
						<div class="detail-card-header">
							<h2>🛒 Ingredients</h2>
							<span class="ing-count">{recipe.ingredients.length} items</span>
						</div>
						<ul class="ing-list">
							{#each recipe.ingredients as ing}
								<li class="ing-item">
									<span class="ing-dot"></span>
									<span class="ing-name">{ing.name}</span>
									<span class="ing-measure">{ing.measure}</span>
								</li>
							{/each}
						</ul>
					</div>
				</aside>

				<!-- Instructions Main -->
				<div class="instructions-col">
					<div class="detail-card">
						<div class="detail-card-header">
							<h2>📋 Instructions</h2>
							<span class="ing-count">{steps.length} steps</span>
						</div>
						<ol class="steps-list">
							{#each steps as step, i}
								<li class="step-item">
									<div class="step-num">{i + 1}</div>
									<p class="step-text">{step}</p>
								</li>
							{/each}
						</ol>
					</div>

					{#if recipe.youtube && getYoutubeId(recipe.youtube)}
						<div class="detail-card yt-card">
							<div class="detail-card-header">
								<h2>🎥 Video Tutorial</h2>
							</div>
							<div class="yt-frame">
								<iframe
									src="https://www.youtube.com/embed/{getYoutubeId(recipe.youtube)}"
									title="Recipe video"
									frameborder="0"
									allowfullscreen
								></iframe>
							</div>
						</div>
					{/if}

					{#if recipe.source}
						<a href={recipe.source} target="_blank" rel="noopener" class="source-link">
							📄 View Original Source
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- ── MEAL PICKER MODAL (using recipe-modal Stencil component with slots) ── -->
	<recipe-modal
		open={showMealPicker}
		modalTitle="🗓️ Add to Meal Plan"
		size="medium"
		onmodalClose={() => showMealPicker = false}
		onmodalConfirm={confirmMealPlan}
	>
		<!-- Default slot: modal body content -->
		<div class="slot-body">
			<p class="recipe-name">📖 {recipe.title}</p>
			<div class="picker-group">
				<label>Day of the Week</label>
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
		<!-- Named slot: custom footer buttons -->
		<div slot="footer" class="slot-footer">
			<button class="btn btn-secondary" onclick={() => showMealPicker = false}>Cancel</button>
			<button class="btn btn-primary" onclick={confirmMealPlan}>Add to Plan 🗓️</button>
		</div>
	</recipe-modal>
{/if}

<style>
	/* ── Hero ─────────────────────────────── */
	.detail-page { min-height: calc(100vh - var(--nav-height)); }

	.detail-hero {
		height: 520px;
		background-size: cover;
		background-position: center;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
	}

	.hero-glass-overlay {
		position: absolute; inset: 0;
		background: rgba(8, 11, 20, 0.35);
	}

	.hero-gradient {
		position: absolute; inset: 0;
		background: linear-gradient(
			to top,
			rgba(8, 11, 20, 1) 0%,
			rgba(8, 11, 20, 0.7) 35%,
			rgba(8, 11, 20, 0.1) 70%,
			transparent 100%
		);
	}

	.hero-nav {
		position: relative; z-index: 2;
		display: flex; align-items: center; justify-content: space-between;
		padding: 28px 32px;
	}
	.glass-btn {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: white; padding: 9px 20px; border-radius: 50px;
		font-size: 14px; font-weight: 600; cursor: pointer;
		transition: all 0.2s; font-family: inherit;
	}
	.glass-btn:hover { background: rgba(255, 255, 255, 0.2); }
	.hero-actions { display: flex; gap: 12px; align-items: center; }

	.hero-meta {
		position: relative; z-index: 2;
		padding: 0 32px 36px;
		color: white;
	}
	.badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }

	.detail-title {
		font-size: clamp(26px, 4.5vw, 48px);
		font-weight: 900;
		line-height: 1.15;
		letter-spacing: -1px;
		margin-bottom: 14px;
		font-family: 'Playfair Display', Georgia, serif;
		text-shadow: 0 2px 20px rgba(0,0,0,0.5);
	}

	.detail-meta-row { display: flex; gap: 12px; flex-wrap: wrap; }
	.meta-chip {
		display: inline-flex; align-items: center; gap: 6px;
		background: rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 6px 14px; border-radius: 100px;
		font-size: 13px; font-weight: 600; color: white;
	}

	/* ── Content ──────────────────────────── */
	.detail-content { padding-top: 36px; }

	.rating-bar {
		display: flex; align-items: center; gap: 14px;
		margin-bottom: 36px;
		padding: 16px 22px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}
	.rating-label { font-size: 14px; font-weight: 700; color: var(--text-muted); }
	.rating-val { font-size: 13px; font-weight: 700; color: var(--gold); }

	.detail-grid {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 28px;
		align-items: start;
	}

	.ingredients-col { position: sticky; top: calc(var(--nav-height) + 16px); }

	/* ── Detail Card ──────────────────────── */
	.detail-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		margin-bottom: 24px;
	}
	.detail-card-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 18px 22px;
		border-bottom: 1px solid var(--border);
		background: rgba(255, 255, 255, 0.02);
	}
	.detail-card-header h2 {
		font-size: 18px; font-weight: 800; color: var(--text);
		font-family: 'Playfair Display', serif;
	}
	.ing-count {
		background: var(--glass);
		border: 1px solid var(--border);
		color: var(--text-muted);
		padding: 3px 10px; border-radius: 100px;
		font-size: 12px; font-weight: 600;
	}

	/* Ingredients */
	.ing-list { list-style: none; padding: 14px 0; }
	.ing-item {
		display: flex; align-items: center; gap: 10px;
		padding: 10px 22px;
		transition: background 0.15s;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
	}
	.ing-item:last-child { border-bottom: none; }
	.ing-item:hover { background: var(--glass); }
	.ing-dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: var(--primary); flex-shrink: 0;
		box-shadow: 0 0 6px rgba(255, 107, 53, 0.5);
	}
	.ing-name { font-size: 14px; font-weight: 500; color: var(--text-2); flex: 1; }
	.ing-measure { font-size: 13px; font-weight: 700; color: var(--primary); }

	/* Steps */
	.steps-list { list-style: none; padding: 22px; display: flex; flex-direction: column; gap: 20px; }
	.step-item { display: flex; gap: 16px; align-items: flex-start; }
	.step-num {
		min-width: 34px; height: 34px; border-radius: 50%;
		background: linear-gradient(135deg, var(--primary), var(--primary-dark));
		color: white; display: flex; align-items: center; justify-content: center;
		font-size: 13px; font-weight: 800; flex-shrink: 0; margin-top: 1px;
		box-shadow: 0 3px 12px var(--primary-glow);
	}
	.step-text { font-size: 15px; line-height: 1.75; color: var(--text-2); padding-top: 5px; }

	/* YouTube */
	.yt-card .yt-frame {
		position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;
	}
	.yt-card .yt-frame iframe {
		position: absolute; top: 0; left: 0; width: 100%; height: 100%;
	}

	.source-link {
		display: inline-flex; align-items: center; gap: 8px;
		margin-top: 4px; margin-bottom: 24px;
		color: var(--primary); font-size: 14px; font-weight: 600;
		padding: 10px 20px;
		background: rgba(255, 107, 53, 0.08);
		border: 1px solid rgba(255, 107, 53, 0.2);
		border-radius: var(--radius);
		transition: all 0.2s;
	}
	.source-link:hover { background: rgba(255, 107, 53, 0.15); }

	/* ── Slot content styles (inside recipe-modal) ──────────────────────── */
	.slot-body { padding: 4px 0; }

	.recipe-name {
		font-size: 15px; font-weight: 700;
		color: var(--text); margin-bottom: 20px;
		padding: 12px 16px;
		background: var(--glass);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		border-left: 3px solid var(--primary);
	}

	.picker-group { margin-bottom: 20px; }
	.picker-group label {
		display: block; font-size: 12px; font-weight: 700;
		text-transform: uppercase; letter-spacing: 0.08em;
		color: var(--text-muted); margin-bottom: 10px;
	}

	.day-grid {
		display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;
	}
	.day-btn {
		padding: 8px 2px; border-radius: var(--radius);
		border: 1px solid var(--border);
		background: var(--surface); color: var(--text-2);
		font-size: 11px; font-weight: 700; cursor: pointer;
		transition: all 0.15s; font-family: inherit;
		text-align: center;
	}
	.day-btn:hover { border-color: var(--primary); color: var(--primary); }
	.day-btn.selected {
		background: var(--primary); border-color: var(--primary);
		color: white; box-shadow: 0 2px 8px var(--primary-glow);
	}

	.meal-type-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
	.meal-type-btn {
		padding: 10px 8px; border-radius: var(--radius);
		border: 1px solid var(--border);
		background: var(--surface); color: var(--text-2);
		font-size: 13px; font-weight: 600; cursor: pointer;
		transition: all 0.15s; font-family: inherit;
		text-align: center; text-transform: capitalize;
	}
	.meal-type-btn:hover { border-color: var(--primary); color: var(--primary); }
	.meal-type-btn.selected {
		background: linear-gradient(135deg, var(--primary), var(--primary-dark));
		border-color: var(--primary); color: white;
		box-shadow: 0 2px 8px var(--primary-glow);
	}

	.slot-footer {
		display: flex; gap: 10px; width: 100%; justify-content: flex-end;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.detail-grid { grid-template-columns: 1fr; }
		.ingredients-col { position: static; }
		.detail-hero { height: 380px; }
		.hero-nav { padding: 20px; }
		.hero-meta { padding: 0 20px 28px; }
	}
	@media (max-width: 480px) {
		.detail-hero { height: 300px; }
	}
</style>
