// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';

// EC-81: Check whether the user is able to Log In without entering Password
test(qase(81, 'EC-81: Check whether the user is able to Log In without entering Password'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Enter username only
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  await usernameField.fill(VALID_USERNAME);

  // Leave password empty

  // Click login button
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await loginButton.click();

  // Wait for response
  await page.waitForTimeout(1000);

  // User should remain on login page (login should fail)
  await expect(page).toHaveURL(/login/);
});
