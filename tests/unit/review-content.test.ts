import { describe, expect, it } from 'vitest';
import { externalRatings, reviewGroups, verifiedTestimonials } from '../../src/content/review-content';

describe('review content', () => {
  it('keeps external ratings attributed to their source', () => {
    expect(externalRatings.map((item) => item.platform)).toEqual(['Google', 'Deliveroo']);
    expect(externalRatings.every((item) => item.href.startsWith('https://'))).toBe(true);
    expect(externalRatings.every((item) => item.reviewCount > 0)).toBe(true);
  });

  it('supports the planned review categories', () => {
    expect(reviewGroups.map((group) => group.id)).toEqual([
      'restaurant',
      'catering',
      'events',
      'large-orders',
    ]);
  });

  it('does not fabricate individual testimonials', () => {
    expect(verifiedTestimonials).toHaveLength(0);
  });
});
