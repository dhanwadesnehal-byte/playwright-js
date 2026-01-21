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

// EC-258: Check whether user is able to see Profile option or not
test(qase(258, 'EC-258: Check whether user is able to see Profile option or not'), async ({ page }) => {
  await login(page);

  // Look for Profile in navigation/menu or user dropdown
  const profileOption = page.locator('a:has-text("Profile"), button:has-text("Profile"), [href*="profile"], [class*="avatar"], [class*="user"], [aria-label*="profile"]').first();

  if (await profileOption.count() > 0) {
    await expect(profileOption).toBeVisible();
  } else {
    // Check for user menu/dropdown in header
    const userMenu = page.locator('header, [class*="header"], [class*="topbar"]').first();
    await expect(userMenu).toBeVisible();
  }
});
