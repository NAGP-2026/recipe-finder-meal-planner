<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { userRecipes, updateUserRecipe, showToast } from '$lib/stores';
	import type { Recipe } from '$lib/types';
	import { getCategories } from '$lib/api';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let categories: string[] = [];
	let categoriesJson = '[]';
	let recipe: Recipe | null = null;
	let recipeDataJson = '{}';

	$: recipeId = $page.params.id;

	onMount(async () => {
		const recipes = get(userRecipes);
		recipe = recipes.find(r => r.id === recipeId) || null;

		if (!recipe) {
			showToast('Recipe not found', 'error');
			goto('/my-recipes');
			return;
		}

		// Prepare recipe data for the form
		recipeDataJson = JSON.stringify({
			id: recipe.id,
			title: recipe.title,
			description: recipe.description || '',
			ingredients: recipe.ingredients.map(i => i.measure ? `${i.measure} ${i.name}` : i.name).join('\n'),
			instructions: recipe.instructions,
			category: recipe.category,
			area: recipe.area,
			cookTime: recipe.cookTime || '',
			servings: recipe.servings || '',
			image: recipe.image || '',
			tags: recipe.tags.join(', '),
		});

		const EXCLUDED_CATEGORIES = ['Beef'];
		const all = await getCategories();
		categories = all.filter(c => !EXCLUDED_CATEGORIES.includes(c));
		categoriesJson = JSON.stringify(categories.map(c => ({ value: c, label: c })));
	});

	function handleFormSubmit(e: CustomEvent) {
		if (!recipe) return;
		const data = e.detail;
		const updatedRecipe: Recipe = {
			...recipe,
			title: data.title,
			image: data.image || recipe.image,
			category: data.category,
			area: data.area || '',
			instructions: data.instructions,
			ingredients: data.ingredients
				.split('\n')
				.filter((l: string) => l.trim())
				.map((l: string) => ({ name: l.trim(), measure: '' })),
			tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
			cookTime: data.cookTime || '',
			servings: data.servings || '',
			description: data.description || '',
		};
		updateUserRecipe(updatedRecipe);
		showToast(`✅ "${updatedRecipe.title}" updated successfully!`);
		goto('/my-recipes');
	}

	function handleFormCancel() {
		goto('/my-recipes');
	}
</script>

<div class="page">
	<div class="page-header">
		<button class="back-link" onclick={() => goto('/my-recipes')}>← My Recipes</button>
		<h1 class="page-title">✏️ Edit Recipe</h1>
		<p class="page-subtitle">Update your recipe details</p>
	</div>

	{#if recipe}
		<div class="form-container">
			<recipe-form
				recipeData={recipeDataJson}
				categories={categoriesJson}
				isEditing={true}
				onformSubmit={handleFormSubmit}
				onformCancel={handleFormCancel}
			></recipe-form>
		</div>
	{:else}
		<div class="loading-wrapper">
			<loading-spinner size="large" message="Loading recipe..."></loading-spinner>
		</div>
	{/if}
</div>

<style>
	.back-link {
		background: none; border: none; cursor: pointer;
		color: var(--text-muted); font-size: 14px; font-weight: 600;
		padding: 0; margin-bottom: 12px; display: block;
		transition: color 0.2s;
	}
	.back-link:hover { color: var(--primary); }
	.form-container { max-width: 800px; }
</style>
