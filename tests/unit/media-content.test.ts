import { describe, expect, it } from 'vitest';
import { getMenuImage, restaurantMedia } from '../../src/content/media-content';

describe('restaurant media', () => {
  it('tracks the current website hero image and six published dish images', () => {
    expect(restaurantMedia.hero.src).toContain('masalamunchbyshreejifood.com');
    expect(Object.keys(restaurantMedia.menuImages)).toHaveLength(6);
    expect(Object.values(restaurantMedia.menuImages).every((src) => src.startsWith('https://masalamunchbyshreejifood.com/'))).toBe(true);
  });

  it('maps published images only to matching menu items', () => {
    expect(getMenuImage('Samosa Chaat')).toContain('80737_5e36d4a5c76d8c7eaa2c4c225006a14a.png');
    expect(getMenuImage('Paneer Bhurji')).toContain('80737_58924d1ccaa7a37b90d990a611b9a600.png');
    expect(getMenuImage('Vada Pav')).toBeNull();
  });
});
