import { describe, expect, it } from 'vitest';
import { menuCategories, menuItemCount } from '../../src/content/menu-content';

describe('menu content', () => {
  it('contains the expected public menu categories', () => {
    expect(menuCategories.map((category) => category.name)).toEqual([
      'Combos',
      'Salad',
      'Chaat',
      'Sandwich Special',
      'Mumbai Special',
      'North India Curries',
      'Drink',
      'Sweet',
    ]);
  });

  it('contains priced items in every category', () => {
    expect(menuCategories.every((category) => category.items.length > 0)).toBe(true);
    expect(menuCategories.every((category) => category.items.every((item) => item.price.startsWith('£')))).toBe(true);
  });

  it('tracks a non-empty full menu', () => {
    expect(menuItemCount).toBeGreaterThan(30);
  });
});
