import { newSpecPage } from '@stencil/core/testing';
import { FavoriteButton } from './favorite-button';

describe('FavoriteButton', () => {

  it('renders the fav button element', async () => {
    const page = await newSpecPage({
      components: [FavoriteButton],
      html: `<favorite-button></favorite-button>`,
    });
    const btn = page.root?.shadowRoot?.querySelector('.fav-btn');
    expect(btn).toBeTruthy();
  });

  it('adds is-favorite class when isFavorite=true', async () => {
    const page = await newSpecPage({
      components: [FavoriteButton],
      html: `<favorite-button></favorite-button>`,
    });
    const instance = page.rootInstance as FavoriteButton;
    instance.isFavorite = true;
    await page.waitForChanges();

    const btn = page.root?.shadowRoot?.querySelector('.fav-btn');
    expect(btn?.classList.contains('is-favorite')).toBe(true);
  });

  it('does NOT have is-favorite class when isFavorite=false', async () => {
    const page = await newSpecPage({
      components: [FavoriteButton],
      html: `<favorite-button></favorite-button>`,
    });
    // default isFavorite is false
    const btn = page.root?.shadowRoot?.querySelector('.fav-btn');
    expect(btn?.classList.contains('is-favorite')).toBe(false);
  });

  it('emits favoriteToggle with toggled isFavorite on click', async () => {
    const page = await newSpecPage({
      components: [FavoriteButton],
      html: `<favorite-button></favorite-button>`,
    });
    const instance = page.rootInstance as FavoriteButton;
    instance.recipeId = 'abc';
    instance.isFavorite = false;
    await page.waitForChanges();

    const spy = jest.fn();
    page.root?.addEventListener('favoriteToggle', spy);

    const btn = page.root?.shadowRoot?.querySelector('.fav-btn') as HTMLElement;
    btn?.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ id: 'abc', isFavorite: true });
  });

  it('shows label text when showLabel=true', async () => {
    const page = await newSpecPage({
      components: [FavoriteButton],
      html: `<favorite-button></favorite-button>`,
    });
    const instance = page.rootInstance as FavoriteButton;
    instance.showLabel = true;
    instance.isFavorite = false;
    await page.waitForChanges();

    const label = page.root?.shadowRoot?.querySelector('.fav-label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('Add to Favorites');
  });

});
