import { expect, test } from '@playwright/test';

test('loads the visual homepage and exposes accessible primary navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1, name: 'Masala Munch' })).toBeVisible();
  const vegetarianBadge = page.locator('.hero-vegetarian-badge');
  await expect(vegetarianBadge).toBeVisible();
  await expect(vegetarianBadge).toContainText('100% Pure Vegetarian');
  const brand = page.getByRole('link', { name: 'Masala Munch by Shreeji Food home' });
  await expect(brand).toBeVisible();
  await expect(brand.locator('.brand-logo')).toHaveCount(1);
  expect(await brand.evaluate((element) => getComputedStyle(element, '::before').backgroundImage)).toBe('none');

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

test('stops iPad scrolling at the page footer', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('./');

  await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'none');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight - window.scrollY),
    )
    .toBeLessThanOrEqual(1);

  const spaceAfterFooter = await page.locator('.site-footer').evaluate(
    (footer) =>
      document.documentElement.scrollHeight -
      (footer.getBoundingClientRect().bottom + window.scrollY),
  );
  expect(spaceAfterFooter).toBeLessThanOrEqual(1);
});

test('shows a compact footer with a current copyright year', async ({ page }) => {
  await page.goto('./');

  const footer = page.locator('.site-footer');
  const currentYear = String(new Date().getFullYear());

  await expect(footer).toContainText('Masala Munch by Shreeji Food');
  await expect(footer).toContainText(`© ${currentYear} Masala Munch by Shreeji Food. All rights reserved.`);
  await expect(footer.locator('#copyright-year')).toHaveAttribute('datetime', currentYear);

  const dividers = await page.evaluate(() => {
    const visit = document.querySelector<HTMLElement>('.visit-section');
    const footer = document.querySelector<HTMLElement>('.site-footer');
    return {
      visitBottom: visit ? getComputedStyle(visit).borderBottomWidth : '',
      footerTop: footer ? getComputedStyle(footer).borderTopWidth : '',
    };
  });

  expect(dividers).toEqual({ visitBottom: '0px', footerTop: '1px' });
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
  expect(structuredData).toContain('"servesCuisine": ["Indian", "Vegetarian"]');
  expect(structuredData).toContain('"postalCode": "BS16 3HJ"');
  expect(structuredData).toContain('"image": "https://masalamunchbyshreejifood.com/');
});

test('publishes branded browser and mobile shortcut icons', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toHaveAttribute(
    'href',
    '/restaurant-web-app/favicon-32.png',
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/restaurant-web-app/apple-touch-icon.png',
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/restaurant-web-app/site.webmanifest',
  );

  const manifestResponse = await page.request.get('./site.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = (await manifestResponse.json()) as {
    name: string;
    icons: Array<{ src: string; sizes: string }>;
  };
  expect(manifest.name).toBe('Masala Munch by Shreeji Food');
  expect(manifest.icons).toEqual([
    { src: '/restaurant-web-app/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/restaurant-web-app/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  ]);
});

test('shows streamlined visit actions, clickable map and current opening hours', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  await expect(page.getByText('Masala Munch by Shreeji Food', { exact: true })).toBeVisible();
  await expect(page.locator('.visit-map iframe')).toHaveAttribute(
    'src',
    /google\.com\/maps\?q=Masala%20Munch%20by%20Shreeji%20Food.*664%20Fishponds.*output=embed/,
  );
  await expect(page.getByRole('link', { name: 'Open directions to Masala Munch in Google Maps' })).toHaveAttribute(
    'href',
    /google\.com\/maps\/search\/\?api=1&query=Masala\+Munch\+by\+Shreeji\+Food.*664\+Fishponds.*BS16\+3HJ/,
  );
  await expect(page.getByText('Tap map for directions ↗')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Directions', exact: true })).toHaveCount(0);

  const callLink = page.getByRole('link', { name: /Call Masala Munch on 07733 849772/ });
  await expect(callLink).toHaveAttribute('href', 'tel:+447733849772');
  await expect(callLink).toContainText('07733 849772');

  const widths = await page.locator('.contact-actions').evaluate((actions) => {
    const call = actions.querySelector<HTMLElement>('#phone-link');
    return {
      actions: actions.getBoundingClientRect().width,
      call: call?.getBoundingClientRect().width ?? 0,
    };
  });
  expect(Math.abs(widths.actions - widths.call)).toBeLessThanOrEqual(1);

  await expect(page.getByRole('heading', { name: 'Opening hours' })).toBeVisible();
  await expect(page.getByText('14:00–22:00')).toBeVisible();
  await expect(page.getByText('17:00–22:00')).toHaveCount(5);

  const status = page.locator('#opening-status');
  await expect(status).toHaveAttribute('data-state', /open|closed/);
  await expect(page.locator('#opening-status-label')).toHaveText(/Open now|Closed now/);

  const hoursCard = page.locator('.hours-card');
  await expect(hoursCard).toContainText('Last orders 15 minutes before closing.');
  await expect(hoursCard.getByRole('link', { name: 'Call Masala Munch for click and collect' })).toHaveAttribute(
    'href',
    'tel:+447733849772',
  );
  await expect(hoursCard.locator('.visit-highlight')).toHaveCount(3);
  await expect(hoursCard).toContainText('Walk-ins');
  await expect(hoursCard).toContainText('Cards & Apple Pay');
  await expect(hoursCard).toContainText('100% Pure Vegetarian');

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

test('loads each locally hosted menu image on its matching card', async ({ page }) => {
  await page.goto('./');

  const localMenuImages = page.locator('#menu-categories .menu-item-image[src*="/images/menu/"]');
  await expect(localMenuImages).toHaveCount(21);
  await expect(
    page
      .locator('.menu-item-card')
      .filter({ has: page.getByRole('heading', { name: 'Vada Pav', exact: true }) })
      .getByRole('img'),
  ).toHaveAttribute('src', '/restaurant-web-app/images/menu/vada-pav.webp');

  const failedImages = await localMenuImages.evaluateAll((images) =>
    images.filter((image) => !(image instanceof HTMLImageElement) || !image.complete || image.naturalWidth === 0).length,
  );
  expect(failedImages).toBe(0);
});

test('highlights Deliveroo popular menu items', async ({ page }) => {
  await page.goto('./');

  const popularItems = ['Sev Puri', 'Paneer Tikka Masala', 'Mattar Paneer', 'Paneer Bhurji'];
  await expect(page.locator('.menu-item-popular')).toHaveCount(popularItems.length);

  for (const itemName of popularItems) {
    const card = page.locator('.menu-item-card').filter({ has: page.getByRole('heading', { name: itemName, exact: true }) });
    await expect(card.getByText('Popular', { exact: true })).toBeVisible();
  }
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
  const googleCard = page.getByRole('link', { name: 'View Google reviews' });
  const deliverooCard = page.getByRole('link', { name: 'View Deliveroo reviews' });
  await expect(googleCard).toHaveClass(/rating-card/);
  await expect(deliverooCard).toHaveClass(/rating-card/);
  await expect(googleCard).toContainText('75 reviews');
  await expect(deliverooCard).toContainText('32 reviews');
  await expect(page.getByText('View reviews', { exact: true })).toHaveCount(0);
  await expect(page.locator('.rating-card-arrow')).toHaveCount(2);
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
