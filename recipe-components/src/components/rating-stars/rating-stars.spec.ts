import { newSpecPage } from '@stencil/core/testing';
import { RatingStars } from './rating-stars';

describe('RatingStars', () => {

  it('renders the correct number of star buttons (default maxRating=5)', async () => {
    const page = await newSpecPage({
      components: [RatingStars],
      html: `<rating-stars></rating-stars>`,
    });
    const stars = page.root?.shadowRoot?.querySelectorAll('.star-btn');
    expect(stars?.length).toBe(5);
  });

  it('marks stars up to rating as filled, rest as empty', async () => {
    const page = await newSpecPage({
      components: [RatingStars],
      html: `<rating-stars></rating-stars>`,
    });
    const instance = page.rootInstance as RatingStars;
    instance.rating = 3;
    instance.maxRating = 5;
    await page.waitForChanges();

    const filled = page.root?.shadowRoot?.querySelectorAll('.star-btn.filled');
    const empty  = page.root?.shadowRoot?.querySelectorAll('.star-btn.empty');
    expect(filled?.length).toBe(3);
    expect(empty?.length).toBe(2);
  });

  it('disables all star buttons when readonly=true', async () => {
    // Pass readonly via HTML attribute so Stencil initialises the @Prop
    // before first render (avoids the "immutable @Prop" guard that fires
    // when mutations happen on the instance directly after render).
    // We also check hasAttribute('disabled') because Stencil's jsdom test
    // renderer exposes disabled as an attribute rather than an IDL property.
    const page = await newSpecPage({
      components: [RatingStars],
      html: `<rating-stars readonly="true"></rating-stars>`,
    });

    const btns = page.root?.shadowRoot?.querySelectorAll('.star-btn');
    expect(btns?.length).toBeGreaterThan(0);
    btns?.forEach(btn => expect(btn.hasAttribute('disabled')).toBe(true));
  });

  it('emits ratingChange with the clicked star number when not readonly', async () => {
    const page = await newSpecPage({
      components: [RatingStars],
      html: `<rating-stars></rating-stars>`,
    });
    const instance = page.rootInstance as RatingStars;
    instance.rating = 0;
    instance.readonly = false;
    await page.waitForChanges();

    const spy = jest.fn();
    page.root?.addEventListener('ratingChange', spy);

    // Click the 4th star (index 3)
    const stars = page.root?.shadowRoot?.querySelectorAll('.star-btn');
    (stars?.[3] as HTMLElement)?.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toBe(4);
  });

  it('shows rating value text when showValue=true and rating > 0', async () => {
    const page = await newSpecPage({
      components: [RatingStars],
      html: `<rating-stars></rating-stars>`,
    });
    const instance = page.rootInstance as RatingStars;
    instance.rating = 4;
    instance.showValue = true;
    await page.waitForChanges();

    const valueEl = page.root?.shadowRoot?.querySelector('.rating-value');
    expect(valueEl?.textContent).toBe('4.0');
  });

});
