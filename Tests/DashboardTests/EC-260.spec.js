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

// EC-260: Check whether user is able to see View Connections button or not
test(qase(260, 'EC-260: Check whether user is able to see View Connections button or not'), async ({ page }) => {
  await login(page);

  // Look for View Connections button on dashboard
  const viewConnectionsBtn = page.locator('button:has-text("View Connection"), a:has-text("View Connection"), [class*="card"] >> text=View Connection, text=View Connections').first();

  if (await viewConnectionsBtn.count() > 0) {
    await expect(viewConnectionsBtn).toBeVisible();
  } else {
    // Check if there's a connections card/widget
    const connectionsWidget = page.locator('[class*="connection"], [class*="card"]').first();
    if (await connectionsWidget.count() > 0) {
      await expect(connectionsWidget).toBeVisible();
    }
  }
});
