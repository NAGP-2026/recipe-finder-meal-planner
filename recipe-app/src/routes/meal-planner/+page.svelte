<script lang="ts">
	import { goto } from '$app/navigation';
	import { mealPlan, removeFromMealPlan, clearMealPlan, showToast } from '$lib/stores';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';

	const mealIcons: Record<string, string> = {
		breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎',
	};
	const mealColors: Record<string, string> = {
		breakfast: '#F59E0B', lunch: '#06D6A0', dinner: '#8B5CF6', snack: '#FF6B35',
	};

	function handleRemove(day: string, mealType: string) {
		removeFromMealPlan(day, mealType);
		showToast('Meal removed from plan');
	}

	function handleClearAll() {
		if (confirm('Clear the entire meal plan?')) {
			clearMealPlan();
			showToast('Meal plan cleared');
		}
	}

	function viewRecipe(recipeId: string) { goto(`/recipes/${recipeId}`); }

	$: totalMeals = Object.values($mealPlan).reduce(
		(sum, dayMeals) => sum + Object.values(dayMeals).filter(Boolean).length, 0
	);
	$: filledDays = Object.values($mealPlan).filter(
		dayMeals => Object.values(dayMeals).some(Boolean)
	).length;
</script>

<div class="page">
	<!-- Header -->
	<div class="planner-header">
		<div>
			<h1 class="page-title">📅 Weekly Meal Planner</h1>
			<p class="page-subtitle">Plan every meal for a perfect, balanced week</p>
		</div>
		<div class="header-actions">
			{#if totalMeals > 0}
				<button class="btn btn-danger" onclick={handleClearAll}>🗑️ Clear All</button>
			{/if}
			<a href="/" class="btn btn-primary">+ Add Recipes</a>
		</div>
	</div>

	<!-- Stats -->
	{#if totalMeals > 0}
		<div class="planner-stats">
			<div class="stat-card">
				<span class="stat-value">{totalMeals}</span>
				<span class="stat-label">Total Meals</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{filledDays}</span>
				<span class="stat-label">Days Planned</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{7 - filledDays}</span>
				<span class="stat-label">Days Remaining</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{Math.round((totalMeals / 28) * 100)}%</span>
				<span class="stat-label">Week Complete</span>
			</div>
		</div>

		<!-- Progress Bar -->
		<div class="progress-bar-wrap">
			<div class="progress-bar-bg">
				<div class="progress-bar-fill" style="width: {Math.round((totalMeals / 28) * 100)}%"></div>
			</div>
			<span class="progress-label">{totalMeals} / 28 meals planned</span>
		</div>
	{/if}

	{#if totalMeals === 0}
		<div class="empty-state">
			<div class="empty-icon">📅</div>
			<h3>Your meal plan is empty</h3>
			<p>Browse recipes and click "Meal Plan" on any recipe card to start building your perfect week</p>
			<a href="/" class="btn btn-primary btn-lg">🍽️ Discover Recipes</a>
		</div>
	{:else}
		<div class="planner-grid">
			{#each DAYS_OF_WEEK as day}
				<div class="day-col">
					<div class="day-header">
						<span class="day-name">{day.slice(0, 3)}</span>
						<span class="day-full">{day}</span>
						{#if $mealPlan[day]}
							{@const count = Object.values($mealPlan[day]).filter(Boolean).length}
							{#if count > 0}
								<span class="day-badge">{count}</span>
							{/if}
						{/if}
					</div>

					<div class="day-meals">
						{#each MEAL_TYPES as mealType}
							{@const slot = $mealPlan[day]?.[mealType]}
							<div class="meal-slot {slot ? 'filled' : 'empty'}">
								<div class="slot-type" style="color: {mealColors[mealType]}">
									<span>{mealIcons[mealType]}</span>
									<span class="type-name">{mealType}</span>
								</div>

								{#if slot}
									<div class="slot-recipe">
										<img src={slot.recipeImage} alt={slot.recipeTitle} class="slot-img" loading="lazy" />
										<p class="slot-title">{slot.recipeTitle}</p>
										<div class="slot-actions">
											<button class="slot-view-btn" onclick={() => viewRecipe(slot.recipeId)}>
												View Recipe
											</button>
											<button class="slot-remove-btn" onclick={() => handleRemove(day, mealType)} title="Remove">
												✕
											</button>
										</div>
									</div>
								{:else}
									<div class="slot-empty">
										<a href="/" class="slot-add-link">
											<span>+</span>
											Add meal
										</a>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.planner-header {
		display: flex; align-items: flex-start; justify-content: space-between;
		gap: 16px; flex-wrap: wrap; margin-bottom: 28px;
	}
	.header-actions { display: flex; gap: 12px; align-items: center; }

	.planner-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
		margin-bottom: 20px;
	}

	.progress-bar-wrap {
		display: flex; align-items: center; gap: 16px;
		margin-bottom: 36px;
	}
	.progress-bar-bg {
		flex: 1; height: 6px; background: var(--surface-2);
		border-radius: 100px; overflow: hidden;
	}
	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--primary), var(--gold));
		border-radius: 100px;
		transition: width 0.5s ease;
		box-shadow: 0 0 10px rgba(255,107,53,0.4);
	}
	.progress-label { font-size: 13px; color: var(--text-muted); font-weight: 600; white-space: nowrap; }

	/* Grid */
	.planner-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 10px;
		overflow-x: auto;
		padding-bottom: 8px;
	}

	.day-col { min-width: 140px; display: flex; flex-direction: column; gap: 8px; }

	.day-header {
		background: var(--surface-2);
		border: 1px solid var(--border-2);
		border-radius: 12px; padding: 12px 10px;
		text-align: center; position: relative;
		display: flex; flex-direction: column; align-items: center; gap: 2px;
	}
	.day-name { font-size: 16px; font-weight: 800; color: var(--primary); font-family: 'Plus Jakarta Sans', sans-serif; }
	.day-full { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
	.day-badge {
		position: absolute; top: -5px; right: -5px;
		background: var(--primary); color: white;
		border-radius: 50%; width: 18px; height: 18px;
		font-size: 10px; font-weight: 800;
		display: flex; align-items: center; justify-content: center;
		box-shadow: 0 2px 8px var(--primary-glow);
	}

	.day-meals { display: flex; flex-direction: column; gap: 8px; }

	.meal-slot {
		border-radius: 12px; overflow: hidden;
		border: 1px solid var(--border);
		background: var(--surface);
		transition: border-color 0.2s, box-shadow 0.2s;
		min-height: 90px;
	}
	.meal-slot.filled {
		border-color: rgba(255, 107, 53, 0.2);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
	}
	.meal-slot:hover { border-color: var(--border-2); }

	.slot-type {
		display: flex; align-items: center; gap: 5px;
		padding: 7px 10px;
		background: rgba(255,255,255,0.03);
		border-bottom: 1px solid var(--border);
		font-size: 11px; font-weight: 700; text-transform: capitalize;
		letter-spacing: 0.3px;
	}
	.type-name { font-size: 10px; }

	.slot-recipe { padding: 8px; }
	.slot-img {
		width: 100%; height: 68px; object-fit: cover;
		border-radius: 8px; margin-bottom: 6px;
		border: 1px solid var(--border);
	}
	.slot-title {
		font-size: 11px; font-weight: 600; color: var(--text-2);
		line-height: 1.35; display: -webkit-box;
		-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
		margin-bottom: 6px;
	}
	.slot-actions { display: flex; gap: 5px; }
	.slot-view-btn {
		flex: 1; padding: 5px 6px;
		background: rgba(255, 107, 53, 0.1);
		color: var(--primary);
		border: 1px solid rgba(255, 107, 53, 0.2);
		border-radius: 7px; font-size: 10px; font-weight: 700;
		cursor: pointer; transition: all 0.2s; font-family: inherit;
		text-align: center;
	}
	.slot-view-btn:hover { background: rgba(255, 107, 53, 0.2); }
	.slot-remove-btn {
		padding: 5px 7px;
		background: rgba(244, 63, 94, 0.08);
		color: var(--error);
		border: 1px solid rgba(244, 63, 94, 0.15);
		border-radius: 7px; font-size: 10px; font-weight: 700;
		cursor: pointer; transition: all 0.2s;
	}
	.slot-remove-btn:hover { background: rgba(244, 63, 94, 0.18); }

	.slot-empty {
		display: flex; align-items: center; justify-content: center;
		padding: 16px 8px;
	}
	.slot-add-link {
		display: flex; align-items: center; gap: 4px;
		font-size: 11px; font-weight: 600;
		color: var(--text-faint); transition: color 0.2s;
	}
	.slot-add-link:hover { color: var(--primary); }
	.slot-add-link span { font-size: 14px; }

	@media (max-width: 1200px) {
		.planner-grid { grid-template-columns: repeat(4, 1fr); }
		.planner-stats { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 640px) {
		.planner-grid { grid-template-columns: repeat(2, 1fr); }
		.planner-stats { grid-template-columns: repeat(2, 1fr); }
	}
</style>
