import { expect, test } from '@playwright/test';

test('uses an animated hamburger menu on phone-sized screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const toggle = page.locator('#nav-toggle');
  const lines = toggle.locator('.nav-toggle-line');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  const hero = page.locator('#home');

  await expect(toggle).toBeVisible();
  await expect(lines).toHaveCount(3);
  await expect(lines.first()).toBeVisible();
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toBeVisible();

  const heroTopClosed = await hero.evaluate((element) => element.getBoundingClientRect().top);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation menu');
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(lines.nth(1)).toHaveCSS('opacity', '0');

  const heroTopOpen = await hero.evaluate((element) => element.getBoundingClientRect().top);
  expect(heroTopOpen).toBeGreaterThan(heroTopClosed + 100);

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(toggle).toBeFocused();
  await expect(navigation).not.toBeVisible();
});

test('closes the phone menu after selecting a navigation item', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const toggle = page.locator('#nav-toggle');
  await toggle.click();
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Menu' }).click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(page.locator('#menu')).toBeVisible();
});

test('keeps the full navigation visible on iPad and tablet widths', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('./');

  await expect(page.locator('#nav-toggle')).not.toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Contact' })).toBeVisible();
});
