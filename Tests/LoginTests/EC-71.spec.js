// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-71: Check whether user is able to open login page or not
test(qase(71, 'EC-71: Check whether user is able to open login page or not'), async ({ page }) => {
  const response = await page.goto(LOGIN_URL);

  // Verify page loads successfully (200 or 304 status)
  expect([200, 304]).toContain(response?.status());

  // Verify URL is correct
  await expect(page).toHaveURL(LOGIN_URL);

  // Verify page body is visible
  await expect(page.locator('body')).toBeVisible();
});
