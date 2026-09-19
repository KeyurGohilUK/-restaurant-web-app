import { expect, test } from '@playwright/test';

test('loads the branded homepage and exposes accessible primary navigation', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1, name: 'Big flavour. Street-food soul.' })).toBeVisible();

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Catering' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Reviews' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Contact' })).toBeVisible();
});

test('shows structured visit details and menu content', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByText('664 Fishponds Rd, Bristol BS16 3HJ')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Opening hours' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chaat', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mumbai Special', exact: true })).toBeVisible();
});

test('filters the menu by category', async ({ page }) => {
  await page.goto('./');

  await page.getByRole('button', { name: 'Mumbai Special', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Mumbai Special', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Vada Pav', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chaat', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Mumbai Special', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('does not present online ordering in the initial site scope', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: /order/i })).toHaveCount(0);
});
