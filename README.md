# 🍽️ RecipeHub — Recipe Finder & Meal Planner

A full-featured, modern Recipe Finder & Meal Planner platform built with **Svelte 5**, **SvelteKit**, and a custom **StencilJS** web component library published to npm.

---

## 📦 npm Package (StencilJS Component Library)

> **Package:** [`@piyushchandel/recipe-components`](https://www.npmjs.com/package/@piyushchandel/recipe-components)

```bash
npm install @piyushchandel/recipe-components
```

🔗 **npm link:** https://www.npmjs.com/package/@piyushchandel/recipe-components

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
# Clone the repository
git clone https://github.com/NAGP-2026/recipe-finder-meal-planner.git
cd Recipe_Finder_Meal_Planner_Assignment_v2
```

---

### 2️⃣ StencilJS Component Library (source — for reference/development only)

```bash
# Navigate to the component library
cd recipe-components

# Install dependencies
npm install

# Build the library
npm run build

# (Optional) Start in watch mode
npm run start
```

> **Note:** The SvelteKit app consumes `@piyushchandel/recipe-components` **directly from npm** — you do NOT need to build the library locally to run the app.

---

### 3️⃣ SvelteKit Application

```bash
# Navigate to the app
cd recipe-app

# Install dependencies (fetches @piyushchandel/recipe-components from npm registry)
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🏃 Starting the Development Server

```bash
npm run dev --prefix recipe-app
```

Or navigate into the app directory:

```bash
cd recipe-app
npm run dev
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
    │   │   ├── api.ts             # TheMealDB API integration
    │   │   └── stores.ts          # Svelte stores (favorites, meal plan, etc.)
    │   ├── routes/
    │   │   ├── +layout.svelte     # App shell with navbar
    │   │   ├── +layout.ts         # Disable SSR (client-only)
    │   │   ├── +page.svelte       # Home / Discover page
    │   │   ├── favorites/         # Favorites collection
    │   │   ├── meal-planner/      # Weekly meal planner
    │   │   ├── my-recipes/        # User-created recipes
    │   │   └── recipes/
    │   │       ├── [id]/          # API recipe details (uses recipe-modal with slots)
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
- Filter by **category** (Chicken, Beef, Dessert, etc.)
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
- Auto-generated avatar image if no image URL provided
- User recipes appear in the main browse feed

### ❤️ Favorites
- Toggle favorites from any recipe card or detail page
- Persistent storage via **localStorage**
- Dedicated Favorites page with all saved recipes
- Remove recipes from favorites

### 📅 Weekly Meal Planner
- Assign recipes to any day (Mon–Sun) and meal type (Breakfast/Lunch/Dinner/Snack)
- Visual weekly grid showing all planned meals
- Click any planned meal to view its details
- Remove individual meals or clear the entire plan
- Plan statistics (total meals, days planned/remaining)

### ⭐ Rating System
- Rate any recipe 1–5 stars
- Ratings persisted locally per recipe

---

## 🧩 StencilJS Components

The app uses the following **custom web components** from `@piyushchandel/recipe-components`:

| Component | Tag | Purpose |
|-----------|-----|---------|
| RecipeCard | `<recipe-card>` | Displays recipe with image, title, category, favorite & action buttons |
| SearchBar | `<search-bar>` | Search input with debounce, submit & clear |
| FilterPanel | `<filter-panel>` | Category, area, and sort-by filters |
| MealPlanCard | `<meal-plan-card>` | A single meal slot in the planner grid |
| FavoriteButton | `<favorite-button>` | Heart toggle with active/inactive state |
| RecipeBadge | `<recipe-badge>` | Tag/label with variant colors (uses **default slot**) |
| RatingStars | `<rating-stars>` | Interactive 1–5 star rating widget |
| RecipeModal | `<recipe-modal>` | Dialog modal with **default slot** + named **`footer` slot** |
| RecipeForm | `<recipe-form>` | Create/edit form with validation |
| LoadingSpinner | `<loading-spinner>` | Animated loading indicator |

### Integration Patterns Used

- **Props**: Passing recipe data, categories, filter state via component attributes
  ```html
  <recipe-card recipeId="123" title="Spaghetti" image="..." category="Pasta" isFavorite={true}></recipe-card>
  ```

- **Custom Events**: Handling events emitted by Stencil components in SvelteKit
  ```html
  <favorite-button onfavoriteToggle={toggleFavorite}></favorite-button>
  <rating-stars onratingChange={handleRatingChange}></rating-stars>
  <filter-panel onfilterChange={handleFilters}></filter-panel>
  ```

- **Default Slot**: `<recipe-badge>` uses a default slot for label text
  ```html
  <recipe-badge variant="primary">Chicken</recipe-badge>
  ```

- **Named Slot**: `<recipe-modal>` uses both a default slot (body) and a named `footer` slot
  ```html
  <recipe-modal open={showModal} modalTitle="Add to Meal Plan" onmodalClose={...} onmodalConfirm={...}>
    <!-- Default slot: body content projected into modal -->
    <div>
      <p>Recipe: Spaghetti Carbonara</p>
      <!-- day/meal pickers ... -->
    </div>
    <!-- Named footer slot: custom action buttons -->
    <div slot="footer">
      <button onclick={cancel}>Cancel</button>
      <button onclick={confirm}>Add to Plan 📅</button>
    </div>
  </recipe-modal>
  ```

---

## 🌐 API Integration

Powered by the free **[TheMealDB API](https://www.themealdb.com/api.php)**:

| Endpoint | Usage |
|----------|-------|
| `/search.php?s={query}` | Search recipes by name |
| `/lookup.php?i={id}` | Get full recipe details |
| `/random.php` | Get a random recipe |
| `/filter.php?c={category}` | Browse by category |
| `/filter.php?a={area}` | Browse by cuisine |
| `/categories.php` | List all categories |
| `/list.php?a=list` | List all areas |

---

## 🔧 State Management

All application state is managed with **Svelte stores** and persisted to `localStorage`:

| Store | Key | Purpose |
|-------|-----|---------|
| `favorites` | `rf_favorites` | Array of saved Recipe objects |
| `userRecipes` | `rf_user_recipes` | User-created recipes |
| `mealPlan` | `rf_meal_plan` | Weekly meal plan object |
| `ratings` | `rf_ratings` | Per-recipe star ratings |

---

## 📋 Assumptions

1. **No authentication** — all data is stored client-side in `localStorage`.
2. **SSR disabled** — the app runs as a client-only SPA since Stencil web components require browser APIs and `localStorage`.
3. **TheMealDB free API** — no API key required; rate limits apply for heavy use.
4. **User-created recipe images** — if no image URL is provided, a generated avatar placeholder is used.
5. **Stencil package** — the SvelteKit app installs `@piyushchandel/recipe-components` **from the npm public registry**. No local `file:` path is used.
6. **Meal planner** — one recipe per meal slot per day (assigning to an occupied slot overwrites it).
7. **Search** — search is against recipe titles using TheMealDB's `/search.php` endpoint.
8. **Svelte 5 event syntax** — custom events from Stencil are bound using lowercase `on{eventName}` attributes (Svelte 5 / SvelteKit convention for web components).

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
npm run dev       # Start development server (localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run check     # Type-check with svelte-check
```

---

## 🔗 Links

- **npm Package:** https://www.npmjs.com/package/@piyushchandel/recipe-components
- **GitHub:** https://github.com/NAGP-2026/recipe-finder-meal-planner
- **TheMealDB API Docs:** https://www.themealdb.com/api.php

---

## 👤 Author

**Piyush Chandel** — NAGP 2026
