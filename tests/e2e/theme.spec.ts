import { expect, test } from '@playwright/test';

test('applies the restaurant brand palette and professional component styling', async ({ page }) => {
  await page.goto('./');

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      primary: styles.getPropertyValue('--primary').trim(),
      secondary: styles.getPropertyValue('--secondary').trim(),
      tertiary: styles.getPropertyValue('--tertiary').trim(),
      neutral: styles.getPropertyValue('--neutral').trim(),
    };
  });

  expect(tokens).toEqual({
    primary: '#c5221f',
    secondary: '#e86a17',
    tertiary: '#eaa315',
    neutral: '#2c140e',
  });

  const primaryButton = page.locator('.button-primary').first();
  await expect(primaryButton).toHaveCSS('background-color', 'rgb(197, 34, 31)');
  await expect(primaryButton).toHaveCSS('border-radius', '12.8px');

  const activeFilter = page.locator('.menu-filter.is-active').first();
  await expect(activeFilter).toHaveCSS('background-color', 'rgb(197, 34, 31)');
  await expect(activeFilter).toHaveCSS('color', 'rgb(255, 255, 255)');

  const heading = page.getByRole('heading', { level: 1, name: 'Masala Munch' });
  await expect(heading).toHaveCSS('font-family', /Epilogue/);
});

test('clearly highlights the current section in primary navigation', async ({ page }) => {
  await page.goto('./');

  const navToggle = page.locator('#nav-toggle');
  if (await navToggle.isVisible()) await navToggle.click();

  const homeLink = page.locator("#primary-navigation a[href='#home']");
  const reviewsLink = page.locator("#primary-navigation a[href='#reviews']");

  await expect(homeLink).toHaveCSS('background-color', 'rgb(197, 34, 31)');
  await expect(homeLink).toHaveCSS('color', 'rgb(255, 255, 255)');

  await reviewsLink.click();
  await expect(page).toHaveURL(/#reviews$/);
  await expect(reviewsLink).toHaveCSS('background-color', 'rgb(197, 34, 31)');
  await expect(reviewsLink).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(homeLink).not.toHaveCSS('background-color', 'rgb(197, 34, 31)');
});

test('positions selected sections directly below the navigation instead of showing the previous section', async ({
  page,
}) => {
  await page.goto('./');

  const navToggle = page.locator('#nav-toggle');
  if (await navToggle.isVisible()) await navToggle.click();

  await page.locator("#primary-navigation a[href='#menu']").click();
  await expect(page).toHaveURL(/#menu$/);

  const menuSection = page.locator('#menu');
  const readPosition = () =>
    menuSection.evaluate((section) => ({
      top: section.getBoundingClientRect().top,
      scrollPaddingTop: Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
    }));

  await expect
    .poll(async () => {
      const position = await readPosition();
      return position.top - position.scrollPaddingTop;
    })
    .toBeLessThanOrEqual(24);

  const position = await readPosition();

  expect(position.top).toBeGreaterThanOrEqual(position.scrollPaddingTop - 2);
  expect(position.top).toBeLessThanOrEqual(position.scrollPaddingTop + 24);
});

test('uses the brand colour for back to top and returns to the absolute page top', async ({ page }) => {
  await page.goto('./');

  const cookieAccept = page.locator('#cookie-accept');
  if (await cookieAccept.isVisible()) await cookieAccept.click();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const backToTop = page.locator(".footer-links a[href='#home']");
  await expect(backToTop).toHaveClass(/is-visible/);
  await expect(backToTop).toHaveCSS('background-color', 'rgb(197, 34, 31)');
  await expect(backToTop).toHaveCSS('color', 'rgb(255, 255, 255)');

  await backToTop.click();
  await expect(page).toHaveURL(/#home$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
});
