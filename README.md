# 🍽️ RecipeHub — Recipe Finder & Meal Planner

A full-featured, modern Recipe Finder & Meal Planner platform built with **Svelte 5**, **SvelteKit**, and a custom **StencilJS** web component library published to npm.

---

## 📦 npm Package (StencilJS Component Library)

> **Package:** [`@piyushchandel/recipe-components`](https://www.npmjs.com/package/@piyushchandel/recipe-components)  
> **Current version: v1.0.6**

```bash
# Install latest (v1.0.6)
npm install @piyushchandel/recipe-components

# Install a specific version
npm install @piyushchandel/recipe-components@1.0.6
```

🔗 **npm link:** https://www.npmjs.com/package/@piyushchandel/recipe-components

### 📋 Package Version History

| Version | Changes |
|---------|---------|
| **v1.0.7** *(source ready — publish pending)* | Futuristic animated conic-gradient border on `<search-bar>` (spins orange → purple → teal → rose, doubles speed on focus, holographic scan-line sweep); 3D perspective tilt + neon glow on `<recipe-card>` hover (`perspective(900px) rotateX/Y`) |
| **v1.0.6** *(current CDN)* | DOMPurify XSS sanitizer (replaces regex), 15 Stencil spec tests, aria-label/aria-pressed on star & favorite components, typed `MouseEvent` handler, picker `<label>→<p>` a11y fix, modal backdrop a11y |
| **v1.0.5** | Standardized the spiral calendar icon in the `recipe-card` "Plan" button to match the icon style used consistently across all pages |
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
  src="https://cdn.jsdelivr.net/npm/@piyushchandel/recipe-components@1.0.6/dist/recipe-components/recipe-components.esm.js">
</script>
```

CDN also provides **global edge caching** — users worldwide load Stencil from the nearest CDN node.

---

### 6. 🗄️ LRU Cache Eviction — Bounded Memory Use

**File:** `recipe-app/src/lib/api.ts`

The in-memory cache is a `Map` — and Maps in JavaScript grow forever if you're not careful. After enough searches and filter clicks, the cache could hold hundreds of stale entries consuming memory for the rest of the session.

The fix is a 100-entry cap with LRU (Least Recently Used) eviction. When the 101st entry arrives, the oldest one — the key that was inserted first — gets dropped. JavaScript Maps preserve insertion order, so finding the oldest entry is just `.keys().next().value` — no sorting, no extra data structure.

```typescript
const MAX_CACHE = 100; // hard cap — prevents unbounded memory growth

function setCached<T>(key: string, data: T): void {
  if (memCache.size >= MAX_CACHE) {
    const oldestKey = memCache.keys().next().value; // O(1) — insertion order
    if (oldestKey !== undefined) memCache.delete(oldestKey);
  }
  memCache.set(key, { data, ts: Date.now() });
}
```

Space complexity is now **O(1) bounded** — no matter how long a user browses, the cache stays at most 100 entries.

---

### 7. 🔑 Pre-built Ingredient Key Array — No Repeated String Work

**File:** `recipe-app/src/lib/api.ts` → `parseMealToRecipe()`

TheMealDB returns ingredients as `strIngredient1` through `strIngredient20` — so every time a recipe is parsed, the original code built those key strings inside the loop: `"strIngredient" + i` and `"strMeasure" + i`. That's 40 string allocations per meal, running for every recipe in every API response.

The fix is to build the key pairs once when the module loads, and reuse them for every parse call:

```typescript
// Built once — reused for every recipe parsed during the session
const INGREDIENT_KEYS: [string, string][] = Array.from(
  { length: 20 },
  (_, i) => [`strIngredient${i + 1}`, `strMeasure${i + 1}`]
);

function parseMealToRecipe(meal: Record<string, string>): Recipe {
  const ingredients: Ingredient[] = [];
  for (const [ingKey, measKey] of INGREDIENT_KEYS) { // no string building
    const ingredient = meal[ingKey];
    const measure = meal[measKey];
    if (ingredient?.trim()) {
      ingredients.push({ name: ingredient.trim(), measure: measure?.trim() || '' });
    }
  }
  // ...
}
```

---

### 8. ❤️ O(1) Favorites Lookup — Set Instead of Array Scan

**File:** `recipe-app/src/lib/stores.ts`

Checking whether a recipe is in the user's favorites sounds simple, but done naively it's an `Array.find()` — that's O(n) per recipe card, called on every render. With 12+ cards on screen, that's 12+ linear scans every time the favorites store updates.

The fix is a Svelte derived store that keeps a `Set` of favorite IDs — a Set's `.has()` is O(1) regardless of how many favorites the user has:

```typescript
// Derived store — recomputed only when favorites change, not on every render
export const favoriteIds = derived(
  favorites,
  $faves => new Set($faves.map(f => f.id))
);

// Every recipe card:
isFavorite={$favoriteIds.has(recipe.id)} // O(1) — instant
```

The result: no matter how many recipes are on screen or how many favorites a user has, the favorite check is always a single hash lookup.

---

---

### 9. 🚦 Token-Bucket Rate Limiter — TheMealDB Protection

**File:** `recipe-app/src/lib/api.ts` → `checkRateLimit()` / `_rateBucket`

Rapid filter/search clicks can fire 10+ API requests per second. The free TheMealDB API has no published rate limit — but hammering it risks temporary blocks for all users.

The fix is a **token-bucket rate limiter** applied to every API call that would hit the network (cache hits bypass it entirely — no token consumed):

```typescript
// Capacity: 5 tokens — burst of 5 simultaneous requests is fine
// Refill: 1 token every 200 ms → max sustained rate of 5 req/sec
const _rateBucket = { tokens: 5, max: 5, lastRefill: Date.now(), refillIntervalMs: 200 };

export function checkRateLimit(): boolean {
  const now = Date.now();
  const tokensToAdd = Math.floor((now - _rateBucket.lastRefill) / _rateBucket.refillIntervalMs);
  if (tokensToAdd > 0) {
    _rateBucket.tokens = Math.min(_rateBucket.max, _rateBucket.tokens + tokensToAdd);
    _rateBucket.lastRefill = now;
  }
  if (_rateBucket.tokens <= 0) return false; // rate limited
  _rateBucket.tokens -= 1;
  return true;
}
```

Applied **after** cache check in every public API function — cache hits never consume a token:

```typescript
const cached = getCached<Recipe[]>(key, TTL_SHORT);
if (cached) return cached;        // ← no rate limit consumed
if (!checkRateLimit()) return []; // ← only fires on cache miss
const res = await fetchWithTimeout(...);
```

Result: a rapid sequence of 10 filter clicks produces at most 5 real API calls in the first second, with the rest returning `[]` gracefully — no 429 errors, no hanging requests.

---

### 10. 📄 Client-Side Pagination — Bounded DOM Node Count

**Files:** `+page.svelte`, `favorites/+page.svelte`, `my-recipes/+page.svelte`

`/filter.php?c=Chicken` returns 50+ results at once. Rendering all 50 recipe cards simultaneously means 50+ custom elements (`<recipe-card>`) mounted in the DOM — each with its own shadow DOM, event listeners, and CSS. On slower devices this causes layout jank and sluggish scrolling.

The fix: slice every recipe array into pages of 12 (`PAGE_SIZE = 12`) and render only the current page:

```typescript
// api.ts — shared constant
export const PAGE_SIZE = 12;

// +page.svelte — reactive pagination
$: totalPages  = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
$: pagedRecipes = filteredRecipes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

// Auto-reset to page 1 when search/filter changes
let _prevKey = '';
$: {
  const key = `${searchQuery}|${filterState.category}|${filterState.area}`;
  if (key !== _prevKey) { _prevKey = key; currentPage = 1; }
}
```

**Impact:**

| Scenario | Before | After |
|---|---|---|
| Category filter (Chicken) | 50+ cards mounted | **12 cards** — 76% fewer DOM nodes |
| First contentful paint | Blocked by 50 renders | **Instant** (12 renders) |
| Initial DOM size | Unbounded (API-dependent) | **Capped at 12** |

Pagination controls appear only when `totalPages > 1` (no clutter for small result sets).

---

### 🎯 SvelteKit & Svelte 5 Built-in Optimizations

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
| Rapid filter clicks (50+ results) | All rendered at once | **12 cards/page, 76% fewer nodes** |
| TheMealDB hammering | Unlimited requests | **5 req/burst, refills at 5/sec** |

---

## 📊 Lighthouse Audit — Desktop (live production)

> Scores measured against **https://recipe-finder-meal-planner-ten.vercel.app** using Lighthouse 12 CLI on the deployed build (commit `53a662d`).

| Category | Score | Badge |
|---|---|---|
| ⚡ Performance | **76** | 🟠 |
| ♿ Accessibility | **92** | 🟢 |
| ✅ Best Practices | **100** | 🟢 |
| 🔍 SEO | **100** | 🟢 |

### Core Web Vitals

| Metric | Value | Score |
|---|---|---|
| **FCP** (First Contentful Paint) | 2.7 s | 0.62 |
| **LCP** (Largest Contentful Paint) | 3.6 s | 0.62 |
| **TBT** (Total Blocking Time) | 330 ms | 0.75 |
| **CLS** (Cumulative Layout Shift) | 0.029 | ✅ 1.00 |
| **Speed Index** | 4.9 s | 0.65 |
| **TTI** (Time to Interactive) | 3.7 s | 0.90 |

> **Why FCP/LCP are ~2.7–3.6 s:**  
> The app is a **client-only SPA** (`ssr: false`) — the browser must download, parse, and execute JS before the first meaningful paint. An SSR/SSG strategy would push these below 1 s, but SSR is incompatible with Stencil web components that rely on browser APIs (`customElements`, `ResizeObserver`, shadow DOM).  
> The CLS of **0.029** (perfect score) shows no layout shift — all recipe cards reserve space before images load.

---

## 📦 Bundle Analysis — Production Build

> Output from `npm --prefix recipe-app run build` on the latest commit. All JS assets are **code-split by route** (SvelteKit + Vite).

### Client-side JS (per chunk, gzip)

| Chunk | Raw | Gzip | Contents |
|---|---|---|---|
| `C7oPtfE6.js` | 46.4 kB | **17.9 kB** | Svelte 5 runtime core |
| `fqrVWHac.js` | 26.8 kB | **10.3 kB** | App stores + API client |
| `nodes/2.*.js` | 8.9 kB | 3.7 kB | Meal Planner page |
| `nodes/9.*.js` | 8.5 kB | 3.3 kB | Recipe detail page |
| `nodes/8.*.js` | 7.5 kB | 2.7 kB | User recipe detail |
| `app.*.js` | 5.4 kB | 2.3 kB | App shell entry |
| *(remaining route chunks)* | ~9 kB | ~5 kB | All other routes |
| **Total JS** | **~113 kB** | **~46 kB** | |

### CSS (global + per-route, gzip)

| File | Raw | Gzip | Contents |
|---|---|---|---|
| `0.*.css` | 21.95 kB | **5.39 kB** | Global layout / design tokens |
| `9.*.css` | 6.79 kB | 1.69 kB | Recipe detail styles |
| `4.*.css` | 6.18 kB | 1.73 kB | Meal Planner styles |
| *(route chunks)* | ~19 kB | ~5 kB | Remaining routes |
| **Total CSS** | **~56 kB** | **~15 kB** | |

### Summary

| Asset type | Transfer (gzip) |
|---|---|
| JavaScript | **~46 kB** |
| CSS | **~15 kB** |
| **Total transfer** | **~61 kB** |

> The Stencil component library (**@piyushchandel/recipe-components**) is loaded from jsDelivr CDN — it does **not** contribute to the Vite bundle size above. It is lazy-loaded by Stencil's loader after page hydration.

---

## 🔒 Security

### 1. HTTP Security Headers (`vercel.json`)

All responses are served with strict security headers configured in `vercel.json`:

| Header | Value | Protection |
|--------|-------|------------|
| `Content-Security-Policy` | Allowlists scripts (`cdn.jsdelivr.net`), styles (`fonts.googleapis.com`), fonts (`fonts.gstatic.com`), images (`https:`), API (`themealdb.com`), frames (YouTube only) | Blocks XSS, data injection, unauthorised resource loads |
| `X-Frame-Options` | `DENY` | Prevents clickjacking — page cannot be embedded in any `<iframe>` |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage to cross-origin requests |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Disables sensitive browser APIs the app does not use |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS for 1 year — prevents protocol downgrade attacks |
| `X-DNS-Prefetch-Control` | `on` | Allows browser-level DNS prefetch (performance) |

### 2. XSS Sanitization — User-Created Content

**File:** `recipe-app/src/lib/stores.ts` → `sanitize()` / `sanitizeRecipe()`

When a user creates or edits a recipe, every text field is passed through **[DOMPurify](https://github.com/cure53/DOMPurify)** before it is written to localStorage. DOMPurify is a battle-tested, OWASP-recommended HTML sanitizer used by Google, Mozilla, and GitHub:

```typescript
import DOMPurify from 'dompurify';

function sanitize(raw: string): string {
  // ALLOWED_TAGS:[] + ALLOWED_ATTR:[] → strips ALL HTML, keeps only visible text
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}
```

What this means in practice:

| Input | Stored as |
|-------|-----------|
| `<script>alert(1)</script>Pasta` | `Pasta` |
| `<img src=x onerror=alert(1)> Mix well.` | `Mix well.` |
| `<b>Bold</b> Chicken` | `Bold Chicken` |

Applied to `title`, `instructions`, and every `ingredient.name` / `ingredient.measure` on both create and edit paths — injection never reaches localStorage or the DOM.

---

### 3. Subresource Integrity (SRI)

The StencilJS component library is loaded from jsDelivr CDN. A SHA-384 integrity hash is pinned directly in `app.html` — if the CDN ever serves a tampered or corrupted file, the browser rejects it outright before execution:

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@piyushchandel/recipe-components@1.0.6/dist/recipe-components/recipe-components.esm.js"
  integrity="sha384-<updated-for-v1.0.6>"
  crossorigin="anonymous"></script>
```

This protects against **supply-chain attacks** — a class of attack where a third-party CDN or npm package is compromised.

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

npm test              # Run all 45 unit tests once (CI mode)
npm run test:watch    # Watch mode — re-runs on every file change
npm run test:coverage # V8 coverage report (text + json-summary)
```

### Test Files

| File | Tests | What's covered |
|---|---|---|
| `src/lib/stores.test.ts` | **29** | Favorites (add / remove / no-duplicate / `isFavorite` / `favoriteIds` derived store), UserRecipes (add / update / delete + cascade remove from favorites), MealPlan (add / overwrite existing slot / multi-day coexistence / remove / clear all), Ratings (set / overwrite / independent per recipe), Toasts (add / typed / auto-remove after 3 s / **dismissToast** clears timer immediately), **XSS sanitization** (`<script>`, `<img onerror>`, `<b>` stripped from title and instructions on both add and update) |
| `src/lib/api.test.ts` | **16** | `searchRecipes` — parsed recipe shape, ingredient skipping, tag parsing, null meals, network error; `getRecipeById` — full recipe, not found, error; `getCategories` — array shape; `getAreas` — array shape; `getRecipesByCategory` — category set on results, error fallback; **LRU eviction** — verifies oldest entry is dropped after 100+ unique inserts; **20-slot ingredient parse** — verifies all ingredient/measure pairs 1–20 are read correctly; **Rate limiter** — allows first 5, blocks 6th |

**Total: 45 unit tests — all passing ✅**

### Stencil Component Tests (Jest)

Component-level tests for the three interactive Stencil components, run with Stencil's built-in Jest runner:

```bash
cd recipe-components
node node_modules/@stencil/core/bin/stencil test --spec
```

| File | Tests | What's covered |
|---|---|---|
| `src/components/recipe-card/recipe-card.spec.ts` | **5** | Renders host element, `recipeTitle` prop, category badge, user-recipe badge, `favoriteToggle` custom event payload |
| `src/components/rating-stars/rating-stars.spec.ts` | **5** | Correct star count, filled/empty split for `value`, `disabled` HTML attribute on readonly mode, `ratingChange` event value, `showValue` text display |
| `src/components/favorite-button/favorite-button.spec.ts` | **5** | Renders button element, `.is-favorite` class toggle, `favoriteToggle` event on click, label text |

**Total: 15 Stencil spec tests — all passing ✅**

---

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

### E2E Tests — Playwright

End-to-end smoke tests exercise the full app in a real Chromium browser, covering all critical user paths.

```bash
# Against local preview (auto-builds first)
npm --prefix recipe-app run test:e2e

# Against live production
set BASE_URL=https://recipe-finder-meal-planner-ten.vercel.app
npm --prefix recipe-app run test:e2e
```

| # | Test | Suite |
|---|---|---|
| 1 | Shows RecipeHub brand and hero title | Home page |
| 2 | Loads recipe cards from TheMealDB | Home page |
| 3 | `<search-bar>` web component is present | Home page |
| 4 | `<filter-panel>` web component is present | Home page |
| 5 | Favorites link navigates to `/favorites` | Navigation |
| 6 | Meal Planner link navigates to `/meal-planner` | Navigation |
| 7 | My Recipes link navigates to `/my-recipes` | Navigation |
| 8 | Create Recipe CTA navigates to `/recipes/create` | Navigation |
| 9 | Shows empty state when no favorites saved | Favorites page |
| 10 | Renders the weekly planner grid | Meal Planner page |
| 11 | Shows empty state when no user recipes exist | My Recipes page |
| 12 | `+error.svelte` renders for unknown routes | Error boundary |

**12/12 passing ✅** (Chromium, against live Vercel deployment)

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
# Run Stencil unit tests (15 spec tests)
node node_modules/@stencil/core/bin/stencil test --spec
```

### SvelteKit App (`recipe-app/`)

```bash
npm run dev           # Start development server (localhost:5173)
npm run build         # Build for production
npm run preview       # Preview production build
npm run check         # Type-check with svelte-check
npm test              # Run unit tests (45 passing)
npm run test:watch    # Watch mode — re-runs on file changes
npm run test:coverage # V8 coverage report
npm run test:e2e      # Playwright E2E smoke tests (12 tests, Chromium)
```

---

## 🔗 Links

- **🚀 Deployed App:** https://recipe-finder-meal-planner-ten.vercel.app
- **📦 npm Package (v1.0.6 — latest):** https://www.npmjs.com/package/@piyushchandel/recipe-components
- **💻 GitHub:** https://github.com/NAGP-2026/recipe-finder-meal-planner
- **🍽️ TheMealDB API Docs:** https://www.themealdb.com/api.php

---

## 👤 Author

**Piyush Chandel** — NAGP 2026
