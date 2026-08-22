<script lang="ts">
	import { addToMealPlan, showToast } from '$lib/stores';
	import { DAYS_OF_WEEK, MEAL_TYPES } from '$lib/types';
	import type { Recipe } from '$lib/types';

	interface Props {
		show: boolean;
		recipe: Recipe | null;
		onclose: () => void;
	}

	let { show, recipe, onclose }: Props = $props();

	let selectedDay = $state(DAYS_OF_WEEK[0]);
	let selectedMealType = $state(MEAL_TYPES[2]);

	function confirm() {
		if (!recipe) return;
		addToMealPlan(selectedDay, selectedMealType, {
			recipeId: recipe.id,
			recipeTitle: recipe.title,
			recipeImage: recipe.image,
		});
		showToast(`Added to ${selectedDay} ${selectedMealType}! 🗓️`);
		onclose();
	}
</script>

{#if show && recipe}
	<div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add to meal plan">
		<div class="meal-picker-modal">
			<div class="modal-header">
			<h3>🗓️ Add to Meal Plan</h3>
				<button class="modal-close" onclick={onclose} aria-label="Close">✕</button>
			</div>
			<div class="modal-body">
				<p class="recipe-name">📖 {recipe.title}</p>
			<div class="picker-group">
					<p class="picker-label">Day of the Week</p>
					<div class="day-grid">
						{#each DAYS_OF_WEEK as day}
							<button
								class="day-btn {selectedDay === day ? 'selected' : ''}"
								onclick={() => selectedDay = day}
							>
								{day.slice(0, 3)}
							</button>
						{/each}
					</div>
				</div>
			<div class="picker-group">
					<p class="picker-label">Meal Type</p>
					<div class="meal-type-grid">
						{#each MEAL_TYPES as type}
							<button
								class="meal-type-btn {selectedMealType === type ? 'selected' : ''}"
								onclick={() => selectedMealType = type}
							>
								{type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : type === 'dinner' ? '🌙' : '🍎'}
								{type}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-secondary" onclick={onclose}>Cancel</button>
				<button class="btn btn-primary" onclick={confirm}>Add to Plan 🗓️</button>
			</div>
		</div>
	</div>
{/if}
