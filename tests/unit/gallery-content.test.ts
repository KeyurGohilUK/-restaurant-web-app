import { describe, expect, it } from 'vitest';
import { galleryAssetNote, galleryCategories, galleryItems } from '../../src/content/gallery-content';

describe('gallery content', () => {
  it('uses approved food assets from the existing restaurant website', () => {
    expect(galleryCategories).toEqual([{ id: 'food', name: 'Food' }]);
    expect(galleryItems).toHaveLength(6);
    expect(galleryItems.every((item) => item.category === 'food')).toBe(true);
    expect(galleryItems.every((item) => item.image.startsWith('https://masalamunchbyshreejifood.com/'))).toBe(true);
  });

  it('provides meaningful alt text and an asset-source note', () => {
    expect(galleryItems.every((item) => item.alt.length > item.title.length)).toBe(true);
    expect(galleryAssetNote).toMatch(/existing website/i);
    expect(galleryAssetNote).toMatch(/approved assets/i);
  });
});
