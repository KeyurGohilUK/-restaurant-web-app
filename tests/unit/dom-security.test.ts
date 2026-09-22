import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const mainSource = readFileSync(new URL('../../src/main.ts', import.meta.url), 'utf8');

describe('DOM rendering security', () => {
  it('does not use HTML string injection APIs in the main renderer', () => {
    expect(mainSource).not.toContain('.innerHTML');
    expect(mainSource).not.toContain('insertAdjacentHTML');
    expect(mainSource).not.toContain('outerHTML =');
  });
});
