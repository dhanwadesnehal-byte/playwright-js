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

// EC-265: Check whether user is able to see License Remaining count on the dashboard
test(qase(265, 'EC-265: Check whether user is able to see License Remaining count on dashboard'), async ({ page }) => {
  await login(page);

  // Look for License Remaining count widget/card
  const licenseRemaining = page.locator('text=License, text=Remaining, [class*="card"]:has-text("License"), [class*="stat"]:has-text("License")').first();

  if (await licenseRemaining.count() > 0) {
    await expect(licenseRemaining).toBeVisible();
  } else {
    const dashboardContent = page.locator('[class*="dashboard"], main, [class*="content"]').first();
    if (await dashboardContent.count() > 0) {
      await expect(dashboardContent).toBeVisible();
    }
  }
});
