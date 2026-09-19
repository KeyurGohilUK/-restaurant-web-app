import { describe, expect, it } from 'vitest';
import { navigationItems } from '../../src/content/site-content';

describe('primary navigation', () => {
  it('contains the core informational sections', () => {
    expect(navigationItems).toEqual(['Home', 'Menu', 'Catering', 'Reviews', 'Contact']);
  });

  it('does not expose ordering as a primary feature', () => {
    expect(navigationItems).not.toContain('Order');
  });
});
