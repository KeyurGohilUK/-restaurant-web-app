import { expect, test } from '@playwright/test';

test('loads the visual homepage and exposes accessible primary navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1, name: 'Masala Munch' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Masala Munch by Shreeji Food home' })).toBeVisible();

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Menu' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Dietary' })).toHaveCount(0);
  await expect(navigation.getByRole('link', { name: 'Catering' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Reviews' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Visit' })).toBeVisible();
  await expect(page.locator('#dietary')).toHaveCount(0);
});

test('loads production CSS and JavaScript from the renamed GitHub Pages path', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', /\/restaurant-web-app\/assets\//);
  await expect(page.locator('script[type="module"]')).toHaveAttribute('src', /\/restaurant-web-app\/assets\//);
  await expect(page.locator('.hero')).toHaveCSS('position', 'relative');
});

test('uses restaurant imagery as the primary visual language', async ({ page }) => {
  await page.goto('./');

  const heroImage = page.getByRole('img', { name: /Indian dishes, rice and naan/ });
  await expect(heroImage).toHaveAttribute(
    'src',
    /masalamunchbyshreejifood\.com\/cf-cgi\/families\/43185\/resource-types\/background\.png/,
  );

  await expect(page.locator('.favourite-card')).toHaveCount(3);
  await expect(page.getByRole('img', { name: 'Samosa Chaat from Masala Munch by Shreeji Food' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Dahi Puri from Masala Munch by Shreeji Food' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Mattar Paneer from Masala Munch by Shreeji Food' }).first()).toBeVisible();
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
    'https://keyurgohiluk.github.io/restaurant-web-app/',
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

test('keeps dietary guidance inside the menu instead of a separate section', async ({ page }) => {
  await page.goto('./');

  const note = page.getByRole('complementary', { name: 'Dietary information' });
  await expect(note).toBeVisible();
  await expect(note).toContainText('Tell us about allergies or dietary requirements before choosing food.');
  await expect(note.getByRole('link', { name: /Call Masala Munch about allergies or dietary requirements/ })).toHaveAttribute(
    'href',
    'tel:+447733849772',
  );
  await expect(page.locator('#dietary')).toHaveCount(0);
});

test('shows concise catering options and direct enquiry action', async ({ page }) => {
  await page.goto('./');

  const cateringOccasions = page.locator('#catering-occasions');
  await expect(page.getByRole('heading', { name: 'Food worth gathering for.' })).toBeVisible();
  await expect(cateringOccasions.getByText('Celebrations', { exact: true })).toBeVisible();
  await expect(cateringOccasions.getByText('Community events', { exact: true })).toBeVisible();
  await expect(cateringOccasions.getByText('Workplace & group meals', { exact: true })).toBeVisible();
  await expect(cateringOccasions.getByText('Large orders', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Call Masala Munch about catering/ })).toHaveAttribute('href', 'tel:+447733849772');
});

test('shows modern external rating cards without review category placeholders', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { name: 'What people are saying.' })).toBeVisible();
  await expect(page.getByText('75 reviews')).toBeVisible();
  await expect(page.getByText('32 reviews')).toBeVisible();
  await expect(page.locator('.rating-platform-icon')).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'View Google reviews' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Deliveroo reviews' })).toBeVisible();
  await expect(page.locator('#review-filters')).toHaveCount(0);
  await expect(page.locator('#review-results')).toHaveCount(0);
  await expect(page.getByText('Verified feedback coming soon.')).toHaveCount(0);
});

test('ships a branded noindex 404 page', async ({ page }) => {
  await page.goto('./404.html');
  await expect(page.getByRole('heading', { name: 'This page isn’t on the menu.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.getByRole('link', { name: 'Back to Masala Munch' })).toHaveAttribute('href', '/restaurant-web-app/');
});

test('does not present online ordering in the initial site scope', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: /order/i })).toHaveCount(0);
});
