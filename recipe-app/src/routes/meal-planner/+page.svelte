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
	$: weekPct = Math.round((totalMeals / 28) * 100);
</script>

<div class="planner-page">
	<!-- Background orbs -->
	<div class="bg-orb bg-orb-1"></div>
	<div class="bg-orb bg-orb-2"></div>
	<div class="bg-orb bg-orb-3"></div>

	<div class="page">
		<!-- Compact banner header -->
		<div class="planner-banner">
			<div class="banner-left">
				<div class="banner-icon">📅</div>
				<div>
					<h1 class="page-title">Weekly Meal Planner</h1>
					<p class="page-subtitle">Plan every meal for a balanced, perfect week</p>
				</div>
			</div>
			<div class="header-actions">
				{#if totalMeals > 0}
					<div class="progress-pill">
						<div class="progress-track">
							<div class="progress-fill" style="width: {weekPct}%"></div>
						</div>
						<span>{totalMeals}/28</span>
					</div>
					<button class="btn btn-danger btn-sm" onclick={handleClearAll}>🗑️ Clear</button>
				{/if}
				<a href="/" class="btn btn-primary btn-sm">+ Add Recipes</a>
			</div>
		</div>

		<!-- Compact stats row (only when meals exist) -->
		{#if totalMeals > 0}
			<div class="stats-row">
				<div class="stat-pill">
					<span class="sp-value">{totalMeals}</span>
					<span class="sp-label">Meals Planned</span>
				</div>
				<div class="stat-pill">
					<span class="sp-value">{filledDays}</span>
					<span class="sp-label">Days Covered</span>
				</div>
				<div class="stat-pill">
					<span class="sp-value">{7 - filledDays}</span>
					<span class="sp-label">Days Remaining</span>
				</div>
				<div class="stat-pill highlight">
					<span class="sp-value">{weekPct}%</span>
					<span class="sp-label">Week Complete</span>
				</div>
			</div>
		{/if}

		{#if totalMeals === 0}
			<div class="empty-compact">
				<div class="empty-emoji">📅</div>
				<h3>Your meal plan is empty</h3>
				<p>Browse recipes and click <strong>"Meal Plan"</strong> on any card to start building your perfect week</p>
				<a href="/" class="btn btn-primary btn-lg">🍽️ Discover Recipes</a>
			</div>
		{:else}
			<div class="planner-grid">
				{#each DAYS_OF_WEEK as day}
					<div class="day-col">
						<div class="day-header">
							<span class="day-name">{day.slice(0, 3)}</span>
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
												<button class="slot-view-btn" onclick={() => viewRecipe(slot.recipeId)}>View</button>
												<button class="slot-remove-btn" onclick={() => handleRemove(day, mealType)} title="Remove">✕</button>
											</div>
										</div>
									{:else}
										<div class="slot-empty">
											<a href="/" class="slot-add-link"><span>+</span> Add</a>
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
</div>

<style>
	/* ── Purple gradient bg ────────────────────── */
	.planner-page {
		position: relative;
		min-height: calc(100vh - 70px);
		background:
			radial-gradient(ellipse 80% 50% at 5% 0%, rgba(139, 92, 246, 0.16) 0%, transparent 55%),
			radial-gradient(ellipse 60% 40% at 95% 5%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
			radial-gradient(ellipse 50% 30% at 50% 100%, rgba(139, 92, 246, 0.07) 0%, transparent 60%),
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
		background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
		top: -200px; left: -200px;
	}
	.bg-orb-2 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
		top: 80px; right: -80px;
	}
	.bg-orb-3 {
		width: 350px; height: 350px;
		background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%);
		bottom: 15%; left: 45%;
	}

	.planner-page > .page {
		position: relative;
		z-index: 1;
	}

	/* ── Compact banner ───────────────────────── */
	.planner-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 20px;
		padding: 20px 24px;
		background: rgba(139, 92, 246, 0.07);
		border: 1px solid rgba(139, 92, 246, 0.18);
		border-radius: 20px;
		backdrop-filter: blur(10px);
	}

	.banner-left {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.banner-icon {
		font-size: 40px;
		filter: drop-shadow(0 4px 12px rgba(139, 92, 246, 0.5));
		flex-shrink: 0;
	}

	.header-actions {
		display: flex;
		gap: 10px;
		align-items: center;
		flex-wrap: wrap;
	}

	/* Inline progress pill */
	.progress-pill {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(139, 92, 246, 0.1);
		border: 1px solid rgba(139, 92, 246, 0.2);
		border-radius: 100px;
		padding: 6px 16px 6px 10px;
		font-size: 12px;
		font-weight: 700;
		color: #a78bfa;
	}
	.progress-track {
		width: 80px;
		height: 5px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 100px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #8B5CF6, #3B82F6);
		border-radius: 100px;
		transition: width 0.4s ease;
	}

	/* ── Compact stats row ────────────────────── */
	.stats-row {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.stat-pill {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 12px 18px;
		flex: 1;
		min-width: 130px;
	}

	.stat-pill.highlight {
		background: rgba(139, 92, 246, 0.1);
		border-color: rgba(139, 92, 246, 0.2);
	}

	.sp-value {
		font-size: 22px;
		font-weight: 900;
		background: linear-gradient(135deg, #a78bfa, #60a5fa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-family: 'Playfair Display', serif;
	}

	.sp-label {
		font-size: 11px;
		font-weight: 700;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.6px;
	}

	/* ── Compact empty state ──────────────────── */
	.empty-compact {
		text-align: center;
		padding: 48px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.empty-emoji {
		font-size: 60px;
		animation: floatEmoji 4s ease-in-out infinite;
		filter: drop-shadow(0 8px 20px rgba(139, 92, 246, 0.4));
	}

	.empty-compact h3 {
		font-size: 24px;
		font-weight: 800;
		color: var(--text);
		font-family: 'Playfair Display', serif;
	}

	.empty-compact p {
		color: var(--text-muted);
		max-width: 380px;
		font-size: 15px;
		line-height: 1.7;
	}

	@keyframes floatEmoji {
		0%, 100% { transform: translateY(0) rotate(-3deg); }
		50% { transform: translateY(-12px) rotate(3deg); }
	}

	/* ── Planner grid ─────────────────────────── */
	.planner-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 8px;
	}

	.day-col { min-width: 130px; display: flex; flex-direction: column; gap: 6px; }

	.day-header {
		background: rgba(139, 92, 246, 0.1);
		border: 1px solid rgba(139, 92, 246, 0.2);
		border-radius: 10px;
		padding: 10px 8px;
		text-align: center;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}

	.day-name {
		font-size: 14px;
		font-weight: 800;
		color: #a78bfa;
		font-family: 'Plus Jakarta Sans', sans-serif;
	}

	.day-badge {
		position: absolute;
		top: -5px;
		right: -5px;
		background: #8B5CF6;
		color: white;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		font-size: 9px;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(139, 92, 246, 0.5);
	}

	.day-meals { display: flex; flex-direction: column; gap: 6px; }

	.meal-slot {
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--surface);
		transition: border-color 0.2s, box-shadow 0.2s;
		min-height: 80px;
	}

	.meal-slot.filled {
		border-color: rgba(139, 92, 246, 0.22);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	.meal-slot:hover { border-color: var(--border-2); }

	.slot-type {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px 8px;
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid var(--border);
		font-size: 10px;
		font-weight: 700;
		text-transform: capitalize;
		letter-spacing: 0.3px;
	}

	.type-name { font-size: 9px; }

	.slot-recipe { padding: 7px; }

	.slot-img {
		width: 100%;
		height: 60px;
		object-fit: cover;
		border-radius: 7px;
		margin-bottom: 5px;
		border: 1px solid var(--border);
	}

	.slot-title {
		font-size: 10px;
		font-weight: 600;
		color: var(--text-2);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 5px;
	}

	.slot-actions { display: flex; gap: 4px; }

	.slot-view-btn {
		flex: 1;
		padding: 4px 5px;
		background: rgba(139, 92, 246, 0.1);
		color: #a78bfa;
		border: 1px solid rgba(139, 92, 246, 0.2);
		border-radius: 6px;
		font-size: 10px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
		text-align: center;
	}

	.slot-view-btn:hover { background: rgba(139, 92, 246, 0.2); }

	.slot-remove-btn {
		padding: 4px 6px;
		background: rgba(244, 63, 94, 0.08);
		color: var(--error);
		border: 1px solid rgba(244, 63, 94, 0.15);
		border-radius: 6px;
		font-size: 10px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.slot-remove-btn:hover { background: rgba(244, 63, 94, 0.18); }

	.slot-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 14px 6px;
	}

	.slot-add-link {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-faint);
		transition: color 0.2s;
	}

	.slot-add-link:hover { color: #a78bfa; }
	.slot-add-link span { font-size: 13px; }

	@media (max-width: 1200px) {
		.planner-grid { grid-template-columns: repeat(4, 1fr); }
		.stats-row { gap: 8px; }
	}
	@media (max-width: 640px) {
		.planner-grid { grid-template-columns: repeat(2, 1fr); }
		.stats-row { grid-template-columns: repeat(2, 1fr); display: grid; }
	}
</style>
