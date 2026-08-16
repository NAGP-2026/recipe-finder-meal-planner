<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { toasts } from '$lib/stores';
	import '../app.css';

	let mobileMenuOpen = false;
	let scrolled = false;

	onMount(() => {
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

<a href="#main-content" class="skip-link">Skip to main content</a>

<div class="app-wrapper">
	<nav class="navbar {scrolled ? 'scrolled' : ''}" role="navigation" aria-label="Main navigation">
		<div class="nav-container">
			<a href="/" class="nav-brand">
				<span class="brand-icon">🍽️</span>
				<span class="brand-name">RecipeHub</span>
			</a>

			<button
				class="mobile-menu-btn"
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
				aria-controls="main-nav-links"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
			>
				<span></span><span></span><span></span>
			</button>

			<ul id="main-nav-links" role="list" class="nav-links {mobileMenuOpen ? 'open' : ''}">
				{#each navLinks as link}
					<li role="listitem">
						<a
							href={link.href}
							class="nav-link {$page.url.pathname === link.href ? 'active' : ''}"
							aria-current={$page.url.pathname === link.href ? 'page' : undefined}
							onclick={() => mobileMenuOpen = false}
						>
							<span class="nav-icon">{link.icon}</span>
							<span>{link.label}</span>
						</a>
					</li>
				{/each}
				<li role="listitem">
					<a href="/recipes/create" class="nav-cta" onclick={() => mobileMenuOpen = false}>
						+ New Recipe
					</a>
				</li>
			</ul>
		</div>
	</nav>

	<main id="main-content" class="main-content" tabindex="-1">
		<slot />
	</main>

	<footer class="app-footer" role="contentinfo">
		<p>
			🍽️ <strong>RecipeHub</strong> — Powered by
			<a href="https://www.themealdb.com" target="_blank" rel="noopener">TheMealDB</a>
		</p>
	</footer>

	<!-- Toast Notifications -->
	<div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
		{#each $toasts as toast (toast.id)}
			<div class="toast toast-{toast.type}">
				{#if toast.type === 'success'}✅{:else if toast.type === 'error'}❌{:else}ℹ️{/if}
				{toast.message}
			</div>
		{/each}
	</div>
</div>
