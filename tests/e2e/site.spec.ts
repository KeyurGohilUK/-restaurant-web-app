import { expect, test } from '@playwright/test';

test('loads the branded homepage and exposes accessible primary navigation', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1, name: 'Big flavour. Street-food soul.' })).toBeVisible();

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Gallery' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Catering' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Reviews' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Contact' })).toBeVisible();
});

test('shows the verified food story without inventing founder history', async ({ page }) => {
  await page.goto('./');

  await expect(
    page.getByRole('heading', { name: 'Indian street-food favourites, café comforts and curries in Bristol.' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Street-food variety' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Comforting classics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Made for different occasions' })).toBeVisible();
  await expect(page.getByText(/does not publish a verified founder biography or founding history/)).toBeVisible();
});

test('shows an accessible gallery sourced from approved restaurant images', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'A closer look at the food.' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Samosa Chaat served by Masala Munch by Shreeji Food' })).toBeAttached();
  await expect(page.getByRole('img', { name: 'Dahi Puri served by Masala Munch by Shreeji Food' })).toBeAttached();
  await expect(page.locator('#gallery-grid img')).toHaveCount(6);
  await expect(page.getByText(/Venue, catering and event photos will be added when approved assets are available/)).toBeVisible();
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

test('shows catering occasions, planning guidance and direct enquiry action', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'Plan food for your occasion.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Celebrations' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Community events' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workplace & group meals' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Large orders' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Call Masala Munch about catering/ })).toHaveAttribute('href', 'tel:+447733849772');
  await expect(page.getByText(/Catering availability, menu suitability, quantities and pricing/)).toBeVisible();
});

test('shows attributed external ratings and review categories', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'Trusted feedback, clearly sourced.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /View on Google/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /View on Deliveroo/ })).toBeVisible();
  await expect(page.getByText('75 reviews')).toBeVisible();
  await expect(page.getByText('32 reviews')).toBeVisible();

  await page.getByRole('button', { name: 'Catering', exact: true }).click();
  await expect(page.getByText('Verified testimonials coming here.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Catering', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('does not present online ordering in the initial site scope', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: /order/i })).toHaveCount(0);
});
