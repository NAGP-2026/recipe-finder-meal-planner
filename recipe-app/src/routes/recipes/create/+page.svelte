<script lang="ts">
	import { goto } from '$app/navigation';
	import { addUserRecipe, showToast } from '$lib/stores';
	import type { Recipe } from '$lib/types';
	import { getCategories } from '$lib/api';
	import { onMount } from 'svelte';

	let categories: string[] = [];
	let categoriesJson = '[]';

	onMount(async () => {
		categories = await getCategories();
		categoriesJson = JSON.stringify(categories.map(c => ({ value: c, label: c })));
	});

	function handleFormSubmit(e: CustomEvent) {
		const data = e.detail;
		const newRecipe: Recipe = {
			id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			title: data.title,
			image: data.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.title)}&size=400&background=667eea&color=fff&bold=true`,
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
			isUserCreated: true,
			createdAt: Date.now(),
		};
		addUserRecipe(newRecipe);
		showToast(`✅ "${newRecipe.title}" created successfully!`);
		goto('/my-recipes');
	}

	function handleFormCancel() {
		goto('/my-recipes');
	}
</script>

<div class="page">
	<div class="page-header">
		<button class="back-link" onclick={() => goto('/my-recipes')}>← My Recipes</button>
		<h1 class="page-title">✨ Create New Recipe</h1>
		<p class="page-subtitle">Share your culinary creation with the world</p>
	</div>

	<div class="form-container">
		<recipe-form
			categories={categoriesJson}
			isEditing={false}
			onformSubmit={handleFormSubmit}
			onformCancel={handleFormCancel}
		></recipe-form>
	</div>
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
