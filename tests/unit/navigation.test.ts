import { describe, expect, it } from 'vitest';
import { navigationItems } from '../../src/content/site-content';

describe('primary navigation', () => {
  it('contains the core informational sections', () => {
    expect(navigationItems).toEqual(['Home', 'About', 'Menu', 'Catering', 'Reviews', 'Contact']);
  });

  it('does not expose removed gallery or ordering features', () => {
    expect(navigationItems).not.toContain('Gallery');
    expect(navigationItems).not.toContain('Order');
  });
});
