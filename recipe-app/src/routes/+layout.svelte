<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { toasts } from '$lib/stores';
	import '../app.css';

	let mobileMenuOpen = false;
	let scrolled = false;

	onMount(async () => {
		// Use dist/components (dist-custom-elements output) instead of the lazy-loading loader.
		// This is bundled eagerly by Vite so it works correctly in production builds on Vercel.
		// Each component has externalRuntime: false and auto-define-custom-elements behavior.
		await import('@piyushchandel/recipe-components/dist/components/index.js');

		const handleScroll = () => { scrolled = window.scrollY > 20; };
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navLinks = [
		{ href: '/', label: 'Discover', icon: '🔍' },
		{ href: '/favorites', label: 'Favorites', icon: '❤️' },
		{ href: '/meal-planner', label: 'Planner', icon: '📅' },
		{ href: '/my-recipes', label: 'My Recipes', icon: '👨‍🍳' },
	];
</script>

<div class="app-wrapper">
	<nav class="navbar {scrolled ? 'scrolled' : ''}">
		<div class="nav-container">
			<a href="/" class="nav-brand">
				<span class="brand-icon">🍽️</span>
				<span class="brand-name">RecipeHub</span>
			</a>

			<button class="mobile-menu-btn" aria-label="Toggle menu" onclick={() => mobileMenuOpen = !mobileMenuOpen}>
				<span></span><span></span><span></span>
			</button>

			<ul class="nav-links {mobileMenuOpen ? 'open' : ''}">
				{#each navLinks as link}
					<li>
						<a
							href={link.href}
							class="nav-link {$page.url.pathname === link.href ? 'active' : ''}"
							onclick={() => mobileMenuOpen = false}
						>
							<span class="nav-icon">{link.icon}</span>
							<span>{link.label}</span>
						</a>
					</li>
				{/each}
				<li>
					<a href="/recipes/create" class="nav-cta" onclick={() => mobileMenuOpen = false}>
						+ New Recipe
					</a>
				</li>
			</ul>
		</div>
	</nav>

	<main class="main-content">
		<slot />
	</main>

	<footer class="app-footer">
		<p>
			🍽️ <strong>RecipeHub</strong> — Powered by
			<a href="https://www.themealdb.com" target="_blank" rel="noopener">TheMealDB</a>
			· Built with Svelte 5 &amp; StencilJS
		</p>
	</footer>

	<!-- Toast Notifications -->
	<div class="toast-container">
		{#each $toasts as toast (toast.id)}
			<div class="toast toast-{toast.type}">
				{#if toast.type === 'success'}✅{:else if toast.type === 'error'}❌{:else}ℹ️{/if}
				{toast.message}
			</div>
		{/each}
	</div>
</div>
