// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-92: Check whether user is able to Sign In by keeping both fields blank
test(qase(92, 'EC-92: Check whether user is able to Sign In by keeping both fields blank'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

  // Click login without entering any credentials
  await loginButton.click();

  // Wait for response
  await page.waitForTimeout(1000);

  // User should remain on login page (login should fail)
  await expect(page).toHaveURL(/login/);
});
