import { describe, expect, it } from 'vitest';
import {
  cateringMenuIdeas,
  cateringNotice,
  cateringOccasions,
  cateringPlanningSteps,
} from '../../src/content/catering-content';

describe('catering content', () => {
  it('covers the supported catering occasions', () => {
    expect(cateringOccasions.map((occasion) => occasion.id)).toEqual([
      'celebrations',
      'community',
      'workplace',
      'large-orders',
    ]);
  });

  it('provides useful planning guidance without fixed pricing claims', () => {
    expect(cateringPlanningSteps).toHaveLength(3);
    expect(cateringMenuIdeas.length).toBeGreaterThanOrEqual(3);
    expect(cateringNotice.toLowerCase()).toContain('pricing');
    expect(cateringNotice.toLowerCase()).toContain('allerg');
  });
});
