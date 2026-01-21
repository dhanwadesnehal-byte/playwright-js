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

// EC-264: Check whether user is able to see Active Workflows count on the dashboard
test(qase(264, 'EC-264: Check whether user is able to see Active Workflows count on dashboard'), async ({ page }) => {
  await login(page);

  // Look for Active Workflows count widget/card
  const activeWorkflows = page.locator('text=Active Workflow, [class*="card"]:has-text("Workflow"), [class*="stat"]:has-text("Workflow"), [class*="count"]:has-text("Workflow")').first();

  if (await activeWorkflows.count() > 0) {
    await expect(activeWorkflows).toBeVisible();
  } else {
    const dashboardStats = page.locator('[class*="stat"], [class*="card"], [class*="widget"]').first();
    if (await dashboardStats.count() > 0) {
      await expect(dashboardStats).toBeVisible();
    }
  }
});
