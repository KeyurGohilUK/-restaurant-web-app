import { expect, test } from '@playwright/test';

test('uses a hamburger menu on phone-sized screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const toggle = page.locator('#mobile-nav-toggle');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });

  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation menu');
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(toggle).toBeFocused();
  await expect(navigation).not.toBeVisible();
});

test('closes the phone menu after selecting a navigation item', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const toggle = page.locator('#mobile-nav-toggle');
  await toggle.click();
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Menu' }).click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName('Open navigation menu');
  await expect(page.locator('#menu')).toBeVisible();
});

test('keeps the full navigation visible on iPad and tablet widths', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('./');

  await expect(page.locator('#mobile-nav-toggle')).not.toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Contact' })).toBeVisible();
});
