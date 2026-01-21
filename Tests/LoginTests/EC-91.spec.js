// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';

// EC-91: Check whether user is able to set only space as password
test(qase(91, 'EC-91: Check whether user is able to set only space as password'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Enter valid username
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  await usernameField.fill(VALID_USERNAME);

  // Enter only spaces as password
  const spaceOnlyPassword = '     ';

  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(spaceOnlyPassword);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted space-only password
  expect(actualValue).toBe(spaceOnlyPassword);

  // Click login button
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await loginButton.click();

  // Wait for response
  await page.waitForTimeout(1000);

  // User should remain on login page (login should fail with space-only password)
  await expect(page).toHaveURL(/login/);
});
