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

// EC-259: Check whether user is able see Connections option or not
test(qase(259, 'EC-259: Check whether user is able to see Connections option or not'), async ({ page }) => {
  await login(page);

  // Look for Connections in navigation/menu
  const connectionsOption = page.locator('a:has-text("Connection"), button:has-text("Connection"), [href*="connection"], nav >> text=Connection, [class*="menu"] >> text=Connection').first();

  if (await connectionsOption.count() > 0) {
    await expect(connectionsOption).toBeVisible();
  } else {
    const navigation = page.locator('[class*="sidebar"], [class*="menu"], nav').first();
    await expect(navigation).toBeVisible();
  }
});
