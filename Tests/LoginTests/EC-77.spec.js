// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_PASSWORD = 'Mindbowser@123';

// EC-77: Check whether the user is able to Log In without entering Username
test(qase(77, 'EC-77: Check whether the user is able to Log In without entering Username'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Leave username empty, enter only password
  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(VALID_PASSWORD);

  // Click login button
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await loginButton.click();

  // Wait for response
  await page.waitForTimeout(1000);

  // User should remain on login page (login should fail)
  await expect(page).toHaveURL(/login/);
});
