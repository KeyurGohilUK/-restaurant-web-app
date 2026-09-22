import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

const contentSecurityPolicy = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"\s*\/>/)?.[1];
const jsonLdScript = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];

describe('content security policy', () => {
  it('restricts browser resources to the origins the site actually uses', () => {
    expect(contentSecurityPolicy).toBeDefined();
    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain('frame-src https://www.google.com');
    expect(contentSecurityPolicy).toContain('https://masalamunchbyshreejifood.com');
    expect(contentSecurityPolicy).toContain('https://cdn.simpleicons.org');
    expect(contentSecurityPolicy).not.toContain("'unsafe-inline'");
    expect(contentSecurityPolicy).not.toContain("'unsafe-eval'");
  });

  it('allows the static restaurant JSON-LD by its exact hash', () => {
    expect(jsonLdScript).toBeDefined();
    const hash = createHash('sha256').update(jsonLdScript!).digest('base64');
    expect(contentSecurityPolicy).toContain(`'sha256-${hash}'`);
  });
});
