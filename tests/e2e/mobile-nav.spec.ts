import { expect, test } from '@playwright/test';

test('uses an animated hamburger menu on phone-sized screens and expands in page flow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const toggle = page.locator('#nav-toggle');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  const hero = page.locator('#home');
  const lines = toggle.locator('.nav-toggle-line');

  await expect(toggle).toBeVisible();
  await expect(lines).toHaveCount(3);
  await expect(lines.first()).toBeVisible();
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toBeVisible();

  const heroTopBefore = await hero.evaluate((element) => element.getBoundingClientRect().top);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation menu');
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect
    .poll(() => hero.evaluate((element) => element.getBoundingClientRect().top))
    .toBeGreaterThan(heroTopBefore + 100);

  const firstLineTransform = await lines.nth(0).evaluate((element) => getComputedStyle(element).transform);
  const middleLineOpacity = await lines.nth(1).evaluate((element) => getComputedStyle(element).opacity);
  expect(firstLineTransform).not.toBe('none');
  expect(Number(middleLineOpacity)).toBeLessThan(1);

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
