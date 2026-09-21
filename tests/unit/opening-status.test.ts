import { describe, expect, it } from 'vitest';
import { openingHours } from '../../src/content/site-content';
import { getOpeningStatus } from '../../src/features/visit/domain/opening-status';

describe('opening status', () => {
  it('reports open during the configured London opening hours', () => {
    const status = getOpeningStatus(openingHours, new Date('2026-09-21T18:00:00Z'));

    expect(status).toEqual({ isOpen: true, label: 'Open now', detail: 'Closes 22:00' });
  });

  it('reports closed before opening and at closing time', () => {
    expect(getOpeningStatus(openingHours, new Date('2026-09-21T12:00:00Z')).isOpen).toBe(false);
    expect(getOpeningStatus(openingHours, new Date('2026-09-21T21:00:00Z')).isOpen).toBe(false);
  });

  it('reports closed on the configured rest day', () => {
    expect(getOpeningStatus(openingHours, new Date('2026-09-22T18:00:00Z'))).toEqual({
      isOpen: false,
      label: 'Closed now',
      detail: '',
    });
  });

  it('uses Europe/London time when daylight saving is active', () => {
    expect(getOpeningStatus(openingHours, new Date('2026-09-26T13:30:00Z')).isOpen).toBe(true);
  });
});
