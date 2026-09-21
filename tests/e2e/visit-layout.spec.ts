import { expect, test } from '@playwright/test';

test.beforeEach(({ page }, testInfo) => {
  void page;
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    'Visit layout viewports are covered explicitly in this spec.',
  );
});

for (const viewport of [
  { name: 'iPad', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`aligns the visit map bottom edge with opening hours on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('./');

    const map = page.locator('.visit-map');
    const hoursCard = page.locator('.hours-card');
    await expect(map).toBeVisible();
    await expect(hoursCard).toBeVisible();

    const bottoms = await page.evaluate(() => {
      const mapElement = document.querySelector<HTMLElement>('.visit-map');
      const hoursElement = document.querySelector<HTMLElement>('.hours-card');

      return {
        map: mapElement?.getBoundingClientRect().bottom ?? 0,
        hours: hoursElement?.getBoundingClientRect().bottom ?? 0,
      };
    });

    expect(Math.abs(bottoms.map - bottoms.hours)).toBeLessThanOrEqual(1);
  });
}

test('keeps the mobile map-to-opening-hours gap compact', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  const gap = await page.evaluate(() => {
    const mapElement = document.querySelector<HTMLElement>('.visit-map');
    const hoursElement = document.querySelector<HTMLElement>('.hours-card');
    if (!mapElement || !hoursElement) return Number.POSITIVE_INFINITY;

    return hoursElement.getBoundingClientRect().top - mapElement.getBoundingClientRect().bottom;
  });

  expect(gap).toBeLessThanOrEqual(17);
});
