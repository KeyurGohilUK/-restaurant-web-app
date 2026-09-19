import { describe, expect, it } from 'vitest';
import { featuredDishes, openingHours, restaurant, reviewCategories } from '../../src/content/site-content';

describe('site content', () => {
  it('keeps the core restaurant contact details available', () => {
    expect(restaurant.address).toContain('Bristol BS16 3HJ');
    expect(restaurant.phoneHref).toBe('tel:+447733849772');
  });

  it('defines one current opening-hours entry per day', () => {
    expect(openingHours).toHaveLength(7);
    expect(openingHours.find(({ day }) => day === 'Tuesday')?.hours).toBe('Closed');
    expect(openingHours.find(({ day }) => day === 'Saturday')?.hours).toBe('14:00–22:00');
    expect(openingHours.find(({ day }) => day === 'Sunday')?.hours).toBe('17:00–22:00');
  });

  it('keeps homepage highlights populated', () => {
    expect(featuredDishes.length).toBeGreaterThanOrEqual(3);
    expect(reviewCategories).toContain('Catering');
    expect(reviewCategories).toContain('Large orders');
  });
});
