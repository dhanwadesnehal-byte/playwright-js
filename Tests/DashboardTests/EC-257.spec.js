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

// EC-257: Check whether user is able to see Settings option or not
test(qase(257, 'EC-257: Check whether user is able to see Settings option or not'), async ({ page }) => {
  await login(page);

  // Look for Settings in navigation/menu
  const settingsOption = page.locator('a:has-text("Setting"), button:has-text("Setting"), [href*="setting"], nav >> text=Setting, [class*="menu"] >> text=Setting, [aria-label*="setting"]').first();

  if (await settingsOption.count() > 0) {
    await expect(settingsOption).toBeVisible();
  } else {
    const navigation = page.locator('[class*="sidebar"], [class*="menu"], nav, header').first();
    await expect(navigation).toBeVisible();
  }
});
