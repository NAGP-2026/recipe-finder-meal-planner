# 🍽️ RecipeHub — Recipe Finder & Meal Planner

A full-featured, modern Recipe Finder & Meal Planner platform built with **Svelte 5**, **SvelteKit**, and a custom **StencilJS** web component library published to npm.

---

## 📦 npm Package (StencilJS Component Library)

> **Package:** [`@piyushchandel/recipe-components`](https://www.npmjs.com/package/@piyushchandel/recipe-components)  
> **Current version: v1.0.5**

```bash
# Install latest (v1.0.5)
npm install @piyushchandel/recipe-components

# Install a specific version
npm install @piyushchandel/recipe-components@1.0.5
```

🔗 **npm link:** https://www.npmjs.com/package/@piyushchandel/recipe-components

### 📋 Package Version History

| Version | Changes |
|---------|---------|
| **v1.0.5** *(current / latest)* | Replace calendar emoji 📅 → 🗓️ in `recipe-card` "Plan" button for consistent styling across all Stencil components and SvelteKit pages |
| **v1.0.4** | Search bar — visible 2px white border, stronger focus glow; Category badge — dark opaque background (`rgba(8,12,28,0.78)`) always readable on any image color |
| **v1.0.3** | Recipe form — corrected CSS class names to match TSX output (`.form-grid`, `.btn-cancel`, `.btn-submit`); orange gradient submit button; rose/red cancel button |
| **v1.0.2** | Recipe form redesigned — labels `#5c6080` → `#a8b0d0` (visible), input bg 0.04→0.08, border 0.08→0.18, `overflow:hidden` removed (no clipping), select chevron arrow, hover states, gradient form header |
| **v1.0.1** | Search bar — background opacity 0.06→0.18, border 0.12→0.35, placeholder 0.28→0.60, icon opacity 0.5→0.75 |
| **v1.0.0** | Initial release — 10 components: RecipeCard, SearchBar, FilterPanel, MealPlanCard, FavoriteButton, RecipeBadge, RatingStars, RecipeModal, RecipeForm, LoadingSpinner |

---

## 🔗 GitHub Repository

> https://github.com/NAGP-2026/recipe-finder-meal-planner

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

### 1️⃣ Clone & Install

```bash
git clone https://github.com/NAGP-2026/recipe-finder-meal-planner.git
cd Recipe_Finder_Meal_Planner_Assignment_v2
```

---

### 2️⃣ StencilJS Component Library (source — for reference/development only)

```bash
cd recipe-components
npm install
npm run build
# (Optional) Start in watch mode
npm run start
```

> **Note:** The SvelteKit app consumes `@piyushchandel/recipe-components` **directly from npm** — you do NOT need to build the library locally to run the app.

---

### 3️⃣ SvelteKit Application

```bash
cd recipe-app
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🏃 Starting the Development Server

```bash
npm run dev --prefix recipe-app
```

---

## 🏗️ Project Structure

```
Recipe_Finder_Meal_Planner_Assignment_v2/
├── recipe-components/          # StencilJS Web Component Library
│   ├── src/
│   │   ├── components/
│   │   │   ├── recipe-card/       # Recipe card with image, title, actions
│   │   │   ├── search-bar/        # Search input with debounce
│   │   │   ├── filter-panel/      # Category, area & sort filters
│   │   │   ├── meal-plan-card/    # Weekly meal plan slot card
│   │   │   ├── favorite-button/   # Heart toggle button
│   │   │   ├── recipe-badge/      # Tag/badge component (uses slot)
│   │   │   ├── rating-stars/      # Interactive star rating
│   │   │   ├── recipe-modal/      # Modal dialog (default + named slots)
│   │   │   ├── recipe-form/       # Create/edit recipe form
│   │   │   └── loading-spinner/   # Animated loading indicator
│   │   └── index.ts
│   ├── package.json
│   └── stencil.config.ts
│
└── recipe-app/                 # SvelteKit Application
    ├── src/
    │   ├── lib/
    │   │   ├── types.ts           # TypeScript interfaces
    │   │   ├── api.ts             # TheMealDB API integration + caching
    │   │   └── stores.ts          # Svelte stores (favorites, meal plan, etc.)
    │   ├── routes/
    │   │   ├── +layout.svelte     # App shell with navbar
    │   │   ├── +layout.ts         # Disable SSR (client-only)
    │   │   ├── +page.svelte       # Home / Discover page
    │   │   ├── favorites/         # Favorites collection
    │   │   ├── meal-planner/      # Weekly meal planner
    │   │   ├── my-recipes/        # User-created recipes
    │   │   └── recipes/
    │   │       ├── [id]/          # API recipe details
    │   │       ├── user/[id]/     # User recipe details
    │   │       ├── create/        # Create new recipe
    │   │       └── edit/[id]/     # Edit existing recipe
    │   └── app.css               # Global styles
    ├── package.json
    └── svelte.config.js
```

---

## ✨ Features

### 🔍 Recipe Discovery
- Search recipes by name, ingredient, or cuisine
- Browse a curated feed of random recipes
- Filter by **category** (Chicken, Dessert, Pasta, Seafood, etc.)
- Filter by **cuisine/area** (Italian, Japanese, Mexican, etc.)
- Sort by name (A–Z, Z–A)

### 📖 Recipe Details
- Full-screen hero image with overlay
- Complete ingredients list with measures
- Step-by-step numbered instructions
- Embedded YouTube video tutorial (when available)
- Link to original recipe source

### 👨‍🍳 Recipe Management (User Recipes)
- **Create** custom recipes with full form validation
- **Edit** your recipes (title, ingredients, instructions, image, etc.)
- **Delete** recipes with confirmation dialog
- User recipes appear in the main browse feed

### ❤️ Favorites
- Toggle favorites from any recipe card or detail page
- Persistent storage via **localStorage**
- Dedicated Favorites page with all saved recipes

### 📅 Weekly Meal Planner
- Assign recipes to any day (Mon–Sun) and meal type (Breakfast/Lunch/Dinner/Snack)
- Visual weekly grid showing all planned meals
- Remove individual meals or clear the entire plan

### ⭐ Rating System
- Rate any recipe 1–5 stars
- Ratings persisted locally per recipe

### ♿ Accessibility
- **Skip to main content** link — visible on keyboard focus, bypasses navbar for screen reader / keyboard users
- **`aria-current="page"`** on the active navigation link
- **`role="navigation"` + `aria-label="Main navigation"`** on the `<nav>` element
- **`aria-expanded` + `aria-controls`** on the mobile hamburger menu button
- **`role="list"` / `role="listitem"`** on nav `<ul>` / `<li>` elements
- **`aria-live="polite"` + `role="region"` + `aria-label="Notifications"`** on the toast container
- **`role="contentinfo"`** on `<footer>`
- **`<noscript>` fallback** — styled message shown when JavaScript is disabled

---

## ⚡ Performance Optimizations

---

### 1. 🚀 Bulk API Fetch — 12 Requests → 2 Requests

**File:** `recipe-app/src/lib/api.ts` → `getRandomRecipes()`

The naive approach fetches `/random.php` 12 times — one recipe per request — totalling 12 network round-trips.

```
❌ Before: 12 × /random.php  → 12 round-trips  → ~3–5 seconds
✅ After:   2 × /search.php?f={letter} → 2 round-trips → ~0.5–1 second
```

Each letter-search endpoint returns **10–30 recipes in a single JSON response**. Two parallel requests provide plenty of recipes to pick 12 from — reducing API calls by **83%**.

```typescript
// ✅ Optimized: 2 bulk requests instead of 12 individual ones
const allLetters = ['a','b','c','d','e','f','g','h','k','l','m','n','p','r','s','t','v','w'];
const letters = allLetters.sort(() => Math.random() - 0.5).slice(0, 2); // random variety
const responses = await Promise.all(
  letters.map(l => fetchWithTimeout(`${BASE_URL}/search.php?f=${l}`).then(r => r.json()))
);
// Shuffle pool and take first 12
let pool = responses.flatMap(r => (r.meals || []).map(parseMealToRecipe));
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [pool[i], pool[j]] = [pool[j], pool[i]];
}
return pool.slice(0, count);
```

---

### 2. 🗄️ In-Memory API Response Cache with TTL

**File:** `recipe-app/src/lib/api.ts`

All API responses are cached in-memory with a Time-To-Live (TTL). Revisiting the same page or repeating the same search costs **zero additional API calls**.

```typescript
const memCache = new Map<string, { data: unknown; ts: number }>();
const TTL_SHORT = 3 * 60 * 1000;   // 3 min  — recipe results (semi-fresh)
const TTL_LONG  = 30 * 60 * 1000;  // 30 min — categories & areas (stable data)
```

| Cache Key | TTL | Data cached |
|---|---|---|
| `categories` | 30 min | All recipe categories list |
| `areas` | 30 min | All cuisine areas list |
| `random:12` | 3 min | Home page featured recipes |
| `search:{query}` | 3 min | Search results per query |
| `recipe:{id}` | 30 min | Full recipe detail (ingredients, instructions) |
| `cat:{category}` | 30 min | Filtered recipes by category |
| `area:{area}` | 30 min | Filtered recipes by cuisine |

**Impact:**
- **2nd home page visit**: 0 API calls — instant render from memory
- **Back navigation to recipe detail**: instant (cached for 30 min)
- **Repeat search**: instant, no API call

---

### 3. ⏱️ Fetch Timeout with AbortController (8s)

**File:** `recipe-app/src/lib/api.ts` → `fetchWithTimeout()`

Every API request has an **8-second hard timeout**. If TheMealDB is slow or unreachable, requests fail gracefully with an empty result instead of hanging the UI indefinitely.

```typescript
async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e; // caught by caller → returns [] gracefully
  }
}
```

---

### 4. 🔗 Resource Preconnect & DNS Prefetch Hints

**File:** `recipe-app/src/app.html`

Browser resource hints pre-warm TCP connections and resolve DNS **before** JavaScript even runs — eliminating 100–300ms of latency on first API call and CDN load.

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="preconnect" href="https://www.themealdb.com" crossorigin />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
<link rel="dns-prefetch" href="https://www.themealdb.com" />
```

---

### 5. 📦 Stencil Components via CDN (Reliable Lazy Loading)

**File:** `recipe-app/src/app.html`

Stencil uses lazy loading — it fetches component JS chunks (`p-abc123.entry.js`) relative to where the main ESM was loaded. If the script is bundled by Vite, these chunk paths break in production (Vercel can't serve them).

**Solution:** Load Stencil from **jsDelivr CDN**. The CDN hosts the entire npm package including all chunk files. Stencil's runtime fetches chunks from the same CDN origin — always works.

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@piyushchandel/recipe-components@1.0.5/dist/recipe-components/recipe-components.esm.js">
</script>
```

CDN also provides **global edge caching** — users worldwide load Stencil from the nearest CDN node.

---

### 6. 🎯 SvelteKit & Svelte 5 Built-in Optimizations

| Feature | Benefit |
|---|---|
| **Route-based code splitting** | Vite bundles each route separately — only current page JS loads |
| **`data-sveltekit-preload-data="hover"`** | Prefetches route data on hover, before user clicks |
| **Svelte stores (reactive)** | `$favorites`, `$mealPlan`, `$userRecipes` — O(1) updates, no re-fetching |
| **`export const ssr = false`** | Client-only rendering — no hydration overhead, localStorage works directly |
| **Stagger animations via CSS `nth-child`** | No JS animation library — pure CSS, zero runtime cost |

---

### 📊 Before vs After Summary

| Metric | Before | After |
|---|---|---|
| Initial API requests | **12** (random.php ×12) | **2** (letter-search bulk) |
| Est. home page load | ~3–5 seconds | **~0.5–1 second** |
| 2nd visit (within TTL) | 12 API calls again | **0 API calls** (instant) |
| Recipe detail revisit | 1 API call | **0 API calls** (30min cache) |
| Slow/failed API | Hangs indefinitely | **Fails gracefully in ≤8s** |
| CDN DNS overhead | Resolved at runtime | **Pre-resolved before JS** |

---

## 🧩 StencilJS Components

The app uses the following **custom web components** from `@piyushchandel/recipe-components`:

| Component | Tag | Purpose |
|-----------|-----|---------|
| RecipeCard | `<recipe-card>` | Recipe with image, title, favorite & action buttons |
| SearchBar | `<search-bar>` | Search input with debounce, submit & clear |
| FilterPanel | `<filter-panel>` | Category, area, and sort-by filters |
| MealPlanCard | `<meal-plan-card>` | Single meal slot in the planner grid |
| FavoriteButton | `<favorite-button>` | Heart toggle with active/inactive state |
| RecipeBadge | `<recipe-badge>` | Tag/label with variant colors (uses **default slot**) |
| RatingStars | `<rating-stars>` | Interactive 1–5 star rating widget |
| RecipeModal | `<recipe-modal>` | Dialog modal with **default slot** + named **`footer` slot** |
| RecipeForm | `<recipe-form>` | Create/edit form with validation |
| LoadingSpinner | `<loading-spinner>` | Animated loading indicator |

### Integration Patterns Used

- **Props**: Data passed via component attributes
  ```html
  <recipe-card recipeId="123" recipeTitle="Spaghetti" image="..." isFavorite={true}></recipe-card>
  ```

- **Custom Events**: Stencil events handled in SvelteKit
  ```html
  <favorite-button onfavoriteToggle={toggleFavorite}></favorite-button>
  <rating-stars onratingChange={handleRatingChange}></rating-stars>
  <filter-panel onfilterChange={handleFilters} onfilterReset={handleReset}></filter-panel>
  ```

- **Default Slot**: `<recipe-badge>` uses slot for label text
  ```html
  <recipe-badge variant="primary">Chicken</recipe-badge>
  ```

- **Named Slot**: `<recipe-modal>` uses default slot (body) and named `footer` slot
  ```html
  <recipe-modal open={showModal} modalTitle="Add to Meal Plan" onmodalClose={...}>
    <div><!-- body content in default slot --></div>
    <div slot="footer">
      <button onclick={cancel}>Cancel</button>
      <button onclick={confirm}>Add to Plan 🗓️</button>
    </div>
  </recipe-modal>
  ```

---

## 🌐 API Integration

Powered by the free **[TheMealDB API](https://www.themealdb.com/api.php)**:

| Endpoint | Usage |
|----------|-------|
| `/search.php?s={query}` | Search recipes by name |
| `/search.php?f={letter}` | Browse recipes by first letter (bulk fetch) |
| `/lookup.php?i={id}` | Get full recipe details |
| `/filter.php?c={category}` | Browse by category |
| `/filter.php?a={area}` | Browse by cuisine |
| `/categories.php` | List all categories |
| `/list.php?a=list` | List all areas |

---

## 🔧 State Management

All write operations use **Svelte stores** persisted to `localStorage`:

| Store | Key | Purpose |
|-------|-----|---------|
| `favorites` | `rf_favorites` | Array of saved Recipe objects |
| `userRecipes` | `rf_user_recipes` | User-created recipes (CRUD) |
| `mealPlan` | `rf_meal_plan` | Weekly meal plan object |
| `ratings` | `rf_ratings` | Per-recipe star ratings |

> **Pattern:** Open API (TheMealDB) for read-only discovery. localStorage for all CRUD operations.

---

## 🧪 Testing

Unit tests are written with **[Vitest](https://vitest.dev/)** and run in a **jsdom** environment (simulating the browser DOM / localStorage).

### Running Tests

```bash
cd recipe-app

npm test              # Run all 37 tests once (CI mode)
npm run test:watch    # Watch mode — re-runs on every file change
npm run test:coverage # V8 coverage report (text + json-summary)
```

### Test Files

| File | Tests | What's covered |
|---|---|---|
| `src/lib/stores.test.ts` | **25** | Favorites (add / remove / no-duplicate / `isFavorite` / `favoriteIds` derived store), UserRecipes (add / update / delete + cascade remove from favorites), MealPlan (add / overwrite existing slot / multi-day coexistence / remove / clear all), Ratings (set / overwrite / independent per recipe), Toasts (add / typed / auto-remove after 3 s via fake timers) |
| `src/lib/api.test.ts` | **12** | `searchRecipes` — parsed recipe shape, ingredient skipping, tag parsing, null meals, network error; `getRecipeById` — full recipe, not found, error; `getCategories` — array shape; `getAreas` — array shape; `getRecipesByCategory` — category set on results, error fallback |

**Total: 37 tests — all passing ✅**

### Setup

`src/test-setup.ts` provides a full `localStorage` mock (get / set / remove / clear / length / key) for the jsdom environment, so Svelte store persistence can be tested without a real browser.

```typescript
// vite.config.ts — Vitest config
test: {
  environment: 'jsdom',
  globals: true,
  include: ['src/**/*.test.ts'],
  setupFiles: ['src/test-setup.ts'],
  coverage: { provider: 'v8', reporter: ['text', 'json-summary'] },
}
```

---

## 📋 Assumptions

1. **No authentication** — all data is stored client-side in `localStorage`.
2. **SSR disabled** — client-only SPA since Stencil web components require browser APIs.
3. **TheMealDB free API** — no API key required; rate limits apply for heavy use.
4. **Stencil package** — SvelteKit installs `@piyushchandel/recipe-components` **from the npm public registry**.
5. **Meal planner** — one recipe per meal slot per day (assigning to an occupied slot overwrites it).
6. **Svelte 5 event syntax** — custom events from Stencil bound using lowercase `on{eventName}` attributes.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Svelte | 5.x | UI framework (runes syntax) |
| SvelteKit | 2.x | Full-stack framework & routing |
| StencilJS | 4.x | Web component library |
| TypeScript | 6.x | Type safety |
| Vite | 8.x | Build tool |
| TheMealDB | v1 | Free recipe API |

---

## 📝 Available Scripts

### Component Library (`recipe-components/`)

```bash
npm run build     # Build for production
npm run start     # Build in dev/watch mode
npm run generate  # Generate a new component
```

### SvelteKit App (`recipe-app/`)

```bash
npm run dev           # Start development server (localhost:5173)
npm run build         # Build for production
npm run preview       # Preview production build
npm run check         # Type-check with svelte-check
npm test              # Run unit tests (37 passing)
npm run test:watch    # Watch mode — re-runs on file changes
npm run test:coverage # V8 coverage report
```

---

## 🔗 Links

- **🚀 Deployed App:** https://recipe-finder-meal-planner-ten.vercel.app
- **📦 npm Package (v1.0.5 — latest):** https://www.npmjs.com/package/@piyushchandel/recipe-components
- **💻 GitHub:** https://github.com/NAGP-2026/recipe-finder-meal-planner
- **🍽️ TheMealDB API Docs:** https://www.themealdb.com/api.php

---

## 👤 Author

**Piyush Chandel** — NAGP 2026
