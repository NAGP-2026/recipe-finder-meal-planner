import { newSpecPage } from '@stencil/core/testing';
import { RecipeCard } from './recipe-card';

describe('RecipeCard', () => {

  it('renders the host element', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: `<recipe-card></recipe-card>`,
    });
    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.querySelector('.recipe-card')).toBeTruthy();
  });

  it('renders the recipe title from prop', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: `<recipe-card></recipe-card>`,
    });
    const instance = page.rootInstance as RecipeCard;
    instance.recipeTitle = 'Spaghetti Bolognese';
    await page.waitForChanges();

    const title = page.root?.shadowRoot?.querySelector('.card-title');
    expect(title?.textContent).toBe('Spaghetti Bolognese');
  });

  it('shows category badge when category prop is set', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: `<recipe-card></recipe-card>`,
    });
    const instance = page.rootInstance as RecipeCard;
    instance.category = 'Chicken';
    await page.waitForChanges();

    const catBadge = page.root?.shadowRoot?.querySelector('.cat-badge.category');
    expect(catBadge).toBeTruthy();
    expect(catBadge?.textContent?.trim()).toBe('Chicken');
  });

  it('shows My Recipe badge when isUserCreated is true', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: `<recipe-card></recipe-card>`,
    });
    const instance = page.rootInstance as RecipeCard;
    instance.isUserCreated = true;
    await page.waitForChanges();

    const userBadge = page.root?.shadowRoot?.querySelector('.user-badge');
    expect(userBadge).toBeTruthy();
    expect(userBadge?.textContent).toContain('My Recipe');
  });

  it('emits favoriteToggle event with toggled isFavorite when fav button clicked', async () => {
    const page = await newSpecPage({
      components: [RecipeCard],
      html: `<recipe-card></recipe-card>`,
    });
    const instance = page.rootInstance as RecipeCard;
    instance.recipeId = 'r42';
    instance.isFavorite = false;
    await page.waitForChanges();

    const spy = jest.fn();
    page.root?.addEventListener('favoriteToggle', spy);

    const favBtn = page.root?.shadowRoot?.querySelector('.fav-overlay-btn') as HTMLElement;
    favBtn?.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ id: 'r42', isFavorite: true });
  });

});
