import { describe, expect, it } from 'vitest';
import { aboutIntro, aboutPrinciples, aboutVerificationNote } from '../../src/content/about-content';

describe('about content', () => {
  it('describes the verified food proposition without inventing a founder story', () => {
    expect(aboutIntro.title).toContain('Indian street-food');
    expect(aboutIntro.paragraphs.join(' ')).toContain('Fishponds Road');
    expect(aboutPrinciples).toHaveLength(3);
  });

  it('keeps unverified founder history out of the published story', () => {
    expect(aboutVerificationNote).toContain('does not publish a verified founder biography or founding history');
  });
});
