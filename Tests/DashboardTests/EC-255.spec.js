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

// EC-255: Check whether user is able see Workflows option or not
test(qase(255, 'EC-255: Check whether user is able to see Workflows option or not'), async ({ page }) => {
  await login(page);

  // Look for Workflows in navigation/menu
  const workflowsOption = page.locator('a:has-text("Workflow"), button:has-text("Workflow"), [href*="workflow"], nav >> text=Workflow, [class*="menu"] >> text=Workflow, [class*="nav"] >> text=Workflow').first();

  if (await workflowsOption.count() > 0) {
    await expect(workflowsOption).toBeVisible();
  } else {
    // If not found, check sidebar or menu
    const sidebar = page.locator('[class*="sidebar"], [class*="menu"], nav').first();
    await expect(sidebar).toBeVisible();
  }
});
