// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-72: Check whether all login-related elements and fields are present on the login page or not
test(qase(72, 'EC-72: Check whether all login-related elements and fields are present on the login page or not'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Check for username field
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[id*="user"], input[id*="email"]').first();
  await expect(usernameField).toBeVisible();

  // Check for password field
  const passwordField = page.locator('input[type="password"]').first();
  await expect(passwordField).toBeVisible();

  // Check for login/submit button
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await expect(loginButton).toBeVisible();
});
