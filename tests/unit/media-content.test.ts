import { describe, expect, it } from 'vitest';
import { getMenuImage, restaurantMedia } from '../../src/content/media-content';

describe('restaurant media', () => {
  it('tracks the hero, catering and locally hosted menu images', () => {
    expect(restaurantMedia.hero.src).toContain('masalamunchbyshreejifood.com');
    expect(restaurantMedia.catering.src).toBe('/restaurant-web-app/catering-food-spread.jpg.jpeg');
    expect(Object.keys(restaurantMedia.menuImages)).toHaveLength(38);
    expect(
      Object.values(restaurantMedia.menuImages).every(
        (src) => src.startsWith('/restaurant-web-app/images/menu/') && src.endsWith('.webp'),
      ),
    ).toBe(true);
  });

  it('uses matching local images and the placeholder for items without one', () => {
    expect(getMenuImage('Samosa Chaat')).toBe('/restaurant-web-app/images/menu/samosa-chaat.webp');
    expect(getMenuImage('Paneer Bhurji')).toBe('/restaurant-web-app/images/menu/paneer-bhurji.webp');
    expect(getMenuImage('Vada Pav')).toBe('/restaurant-web-app/images/menu/vada-pav.webp');
    expect(getMenuImage('Dahi Puri')).toBe('/restaurant-web-app/images/menu/dahi-puri.webp');
    expect(getMenuImage('Masala Chaas')).toBe('/restaurant-web-app/placeholder-restaurant-light.svg');
  });
});
