import { expect, test } from '@playwright/test';

test('loads the branded homepage and exposes accessible primary navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1, name: 'Big flavour. Street-food soul.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Masala Munch by Shreeji Food home' })).toContainText('Masala Munch');
  await expect(page.getByRole('link', { name: 'Masala Munch by Shreeji Food home' })).toContainText('by Shreeji Food');

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Dietary' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Catering' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Reviews' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Gallery' })).toHaveCount(0);
});

test('uses current restaurant imagery without reintroducing a gallery', async ({ page }) => {
  await page.goto('./');

  const heroImage = page.getByRole('img', { name: /Indian dishes, rice and naan/ });
  await expect(heroImage).toHaveAttribute('src', /masalamunchbyshreejifood\.com\/cf-cgi\/families\/43185\/resource-types\/background\.png/);

  const menuImages = page.locator('.menu-item-image');
  await expect(menuImages).toHaveCount(6);
  await expect(page.getByRole('img', { name: 'Samosa Chaat from Masala Munch by Shreeji Food' })).toBeAttached();
  await expect(page.getByRole('img', { name: 'Paneer Bhurji from Masala Munch by Shreeji Food' })).toBeAttached();
  await expect(page.locator('#gallery')).toHaveCount(0);
});

test('supports keyboard access and avoids horizontal page overflow', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});

test('publishes canonical metadata and Restaurant structured data', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://keyurgohiluk.github.io/-restaurant-web-app/',
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Masala Munch | Indian Street Food in Bristol',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /masalamunchbyshreejifood\.com/);

  const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
  expect(structuredData).toContain('"@type": "Restaurant"');
  expect(structuredData).toContain('"telephone": "+447733849772"');
  expect(structuredData).toContain('"postalCode": "BS16 3HJ"');
  expect(structuredData).toContain('"image": "https://masalamunchbyshreejifood.com/');
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

test('shows structured visit details and current opening hours', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByText('664 Fishponds Rd, Bristol BS16 3HJ')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Opening hours' })).toBeVisible();
  await expect(page.getByText('14:00–22:00')).toBeVisible();
  await expect(page.getByText('17:00–22:00')).toHaveCount(5);
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

test('provides conservative allergen and dietary guidance with a direct contact action', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'Check with us before you choose.' })).toBeVisible();
  await expect(page.getByText(/do not currently publish item-by-item allergen, vegan or other dietary badges/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Before you visit' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'At the restaurant' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Website labels' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Call Masala Munch about allergies or dietary requirements/ })).toHaveAttribute(
    'href',
    'tel:+447733849772',
  );
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

test('ships a branded noindex 404 page', async ({ page }) => {
  await page.goto('./404.html');
  await expect(page.getByRole('heading', { name: 'This page isn’t on the menu.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.getByRole('link', { name: 'Back to Masala Munch' })).toHaveAttribute('href', '/-restaurant-web-app/');
});

test('does not present online ordering in the initial site scope', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: /order/i })).toHaveCount(0);
});
