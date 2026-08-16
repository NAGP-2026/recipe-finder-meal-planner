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

<div class="create-page">
	<!-- Background orbs -->
	<div class="bg-orb bg-orb-1"></div>
	<div class="bg-orb bg-orb-2"></div>
	<div class="bg-orb bg-orb-3"></div>

	<div class="page create-page-content">
		<!-- Page header banner -->
		<div class="create-banner">
			<button class="back-link" onclick={() => goto('/my-recipes')}>
				← My Recipes
			</button>
			<div class="banner-row">
				<div class="banner-icon">✨</div>
				<div>
					<h1 class="page-title">Create New Recipe</h1>
					<p class="page-subtitle">Share your culinary creation with the world</p>
				</div>
			</div>
		</div>

		<!-- Form — max-width with overflow visible to prevent label clipping -->
		<div class="form-wrap">
			<recipe-form
				categories={categoriesJson}
				isEditing={false}
				onformSubmit={handleFormSubmit}
				onformCancel={handleFormCancel}
			></recipe-form>
		</div>
	</div>
</div>

<style>
	/* ── Orange gradient bg (matches my-recipes theme) ── */
	.create-page {
		position: relative;
		min-height: calc(100vh - 70px);
		background:
			radial-gradient(ellipse 80% 50% at 5% 0%, rgba(255, 107, 53, 0.13) 0%, transparent 55%),
			radial-gradient(ellipse 60% 40% at 95% 5%, rgba(245, 158, 11, 0.09) 0%, transparent 50%),
			radial-gradient(ellipse 50% 30% at 50% 100%, rgba(139, 92, 246, 0.07) 0%, transparent 60%),
			#0B0F1E;
		overflow: hidden;
	}

	/* Background orbs */
	.bg-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		pointer-events: none;
		z-index: 0;
	}
	.bg-orb-1 {
		width: 550px; height: 550px;
		background: radial-gradient(circle, rgba(255, 107, 53, 0.16), transparent 70%);
		top: -180px; left: -180px;
	}
	.bg-orb-2 {
		width: 380px; height: 380px;
		background: radial-gradient(circle, rgba(245, 158, 11, 0.11), transparent 70%);
		top: 60px; right: -60px;
	}
	.bg-orb-3 {
		width: 280px; height: 280px;
		background: radial-gradient(circle, rgba(139, 92, 246, 0.09), transparent 70%);
		bottom: 20%; left: 55%;
	}

	/* Page content above orbs */
	.create-page-content {
		position: relative;
		z-index: 1;
		/* Ensure form card labels don't clip at left edge */
		overflow: visible !important;
	}

	/* ── Page header banner ───────────────────── */
	.create-banner {
		margin-bottom: 28px;
		padding: 20px 24px;
		background: rgba(255, 107, 53, 0.06);
		border: 1px solid rgba(255, 107, 53, 0.15);
		border-radius: 20px;
		backdrop-filter: blur(10px);
		max-width: 800px;
	}

	.back-link {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-muted);
		font-size: 13px;
		font-weight: 600;
		padding: 0;
		margin-bottom: 14px;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: color 0.2s;
		font-family: 'Plus Jakarta Sans', sans-serif;
	}
	.back-link:hover { color: var(--primary); }

	.banner-row {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.banner-icon {
		font-size: 40px;
		filter: drop-shadow(0 4px 14px rgba(255, 107, 53, 0.5));
		flex-shrink: 0;
	}

	/* ── Form wrapper ─────────────────────────── */
	.form-wrap {
		max-width: 800px;
		/* overflow visible so Stencil shadow DOM labels never get clipped */
		overflow: visible;
		/* Extra left/right clearance to prevent any edge clipping */
		padding: 0 2px;
	}
</style>
