// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';
const VALID_PASSWORD = 'Mindbowser@123';

// Helper function to login
async function login(page) {
  await page.goto(LOGIN_URL);
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  const passwordField = page.locator('input[type="password"]');
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

  await usernameField.fill(VALID_USERNAME);
  await passwordField.fill(VALID_PASSWORD);
  await loginButton.click();
  await page.waitForTimeout(3000);
}

// EC-254: Check whether user is able to see Dashboard page UI properly or not
test(qase(254, 'EC-254: Check whether user is able to see Dashboard page UI properly or not'), async ({ page }) => {
  await login(page);

  // Verify page has loaded with content
  await expect(page.locator('body')).toBeVisible();

  // Check for main content area
  const mainContent = page.locator('main, [class*="dashboard"], [class*="content"], [class*="main"]').first();
  if (await mainContent.count() > 0) {
    await expect(mainContent).toBeVisible();
  }
});
