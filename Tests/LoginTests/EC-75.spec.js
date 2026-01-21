// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-75: Check whether user is able to see Username and Password fields on the login page or not
test(qase(75, 'EC-75: Check whether user is able to see Username and Password fields on the login page or not'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Check Username field is visible
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[id*="user"], input[id*="email"]').first();
  await expect(usernameField).toBeVisible();

  // Check Password field is visible
  const passwordField = page.locator('input[type="password"]').first();
  await expect(passwordField).toBeVisible();

  // Verify fields are enabled and editable
  await expect(usernameField).toBeEnabled();
  await expect(passwordField).toBeEnabled();
});
