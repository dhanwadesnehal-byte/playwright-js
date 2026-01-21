// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_PASSWORD = 'Mindbowser@123';

// EC-78: Check whether the user is able to Log In using unregistered Username id
test(qase(78, 'EC-78: Check whether the user is able to Log In using unregistered Username id'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Enter unregistered username
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  await usernameField.fill('unregistered_user_12345');

  // Enter valid password
  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(VALID_PASSWORD);

  // Click login button
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await loginButton.click();

  // Wait for response
  await page.waitForTimeout(2000);

  // User should remain on login page (login should fail)
  await expect(page).toHaveURL(/login/);
});
