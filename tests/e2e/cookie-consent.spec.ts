import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => window.localStorage.removeItem('masala-munch-cookie-consent'));
  await page.reload();
});

test('lets visitors accept cookies and remembers the choice', async ({ page }) => {
  const consent = page.getByRole('complementary', { name: 'Cookie consent' });

  await expect(consent).toBeVisible();
  await expect(consent.getByText('This website uses cookies')).toBeVisible();
  await consent.getByRole('button', { name: 'Accept' }).click();
  await expect(consent).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('masala-munch-cookie-consent'))).toBe('accepted');

  await page.reload();
  await expect(consent).toBeHidden();
});

test('lets visitors deny cookies and change the choice later', async ({ page }) => {
  const consent = page.getByRole('complementary', { name: 'Cookie consent' });

  await consent.getByRole('button', { name: 'Deny' }).click();
  await expect(consent).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('masala-munch-cookie-consent'))).toBe('denied');

  await page.getByRole('button', { name: 'Cookie settings' }).click();
  await expect(consent).toBeVisible();
  await expect(consent.getByRole('button', { name: 'Accept' })).toBeFocused();
});
