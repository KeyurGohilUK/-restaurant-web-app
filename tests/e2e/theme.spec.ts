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
  const isMobileNavigation = await navToggle.isVisible();
  if (isMobileNavigation) await navToggle.click();

  const homeLink = page.locator("#primary-navigation a[href='#home']");
  const reviewsLink = page.locator("#primary-navigation a[href='#reviews']");
  const navigation = page.locator('#primary-navigation');
  const indicator = page.locator('.nav-active-indicator');

  await expect(homeLink).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(homeLink).toHaveAttribute('aria-current', 'page');
  await expect(navigation).toHaveAttribute('data-indicator-ready', 'true');
  await expect(indicator).toHaveCSS('background-color', 'rgb(197, 34, 31)');
  await expect(indicator).toHaveCSS('transition-property', /transform/);

  const assertIndicatorTargets = async (link: typeof homeLink) => {
    if (isMobileNavigation) {
      await expect(indicator).toHaveCSS('opacity', '1');
      await expect
        .poll(async () => {
          const bounds = await indicator.boundingBox();
          return Boolean(bounds && bounds.width > 0 && bounds.height > 0);
        })
        .toBe(true);
      return;
    }

    await expect
      .poll(async () => {
        const [indicatorBounds, linkBounds] = await Promise.all([indicator.boundingBox(), link.boundingBox()]);
        if (!indicatorBounds || !linkBounds) return false;
        return (
          Math.abs(indicatorBounds.x - linkBounds.x) <= 1 &&
          Math.abs(indicatorBounds.y - linkBounds.y) <= 1 &&
          Math.abs(indicatorBounds.width - linkBounds.width) <= 1 &&
          Math.abs(indicatorBounds.height - linkBounds.height) <= 1
        );
      })
      .toBe(true);
  };

  await assertIndicatorTargets(homeLink);

  await reviewsLink.click();
  await expect(page).toHaveURL(/#reviews$/);
  await expect(reviewsLink).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(reviewsLink).toHaveAttribute('aria-current', 'page');
  if (isMobileNavigation) await navToggle.click();
  await expect(navigation).toHaveAttribute('data-indicator-ready', 'true');
  await assertIndicatorTargets(reviewsLink);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(homeLink).toHaveAttribute('aria-current', 'page');
  await expect(reviewsLink).not.toHaveAttribute('aria-current', 'page');
  await assertIndicatorTargets(homeLink);
});

test('keeps the open mobile navigation compact and uses full-width menu rows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  await page.locator('#nav-toggle').click();
  const navigation = page.locator('#primary-navigation');
  await expect(navigation).toHaveClass(/is-open/);

  const dimensions = await navigation.evaluate((nav) => {
    const navBox = nav.getBoundingClientRect();
    const firstLink = nav.querySelector('a')?.getBoundingClientRect();
    return {
      height: navBox.height,
      navWidth: navBox.width,
      linkWidth: firstLink?.width ?? 0,
    };
  });

  expect(dimensions.height).toBeLessThan(300);
  expect(dimensions.linkWidth).toBeGreaterThan(dimensions.navWidth * 0.9);
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
