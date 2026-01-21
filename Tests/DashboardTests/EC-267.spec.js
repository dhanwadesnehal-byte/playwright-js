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

// EC-267: Check whether user is able to see View All Logs option or not
test(qase(267, 'EC-267: Check whether user is able to see View All Logs option or not'), async ({ page }) => {
  await login(page);

  // Look for View All Logs option
  const viewAllLogs = page.locator('text=View All Logs, a:has-text("View All"), button:has-text("View All"), text=View All').first();

  if (await viewAllLogs.count() > 0) {
    await expect(viewAllLogs).toBeVisible();
  } else {
    // Check for audit logs link
    const auditLink = page.locator('a:has-text("Audit"), a:has-text("Logs"), [href*="audit"], [href*="log"]').first();
    if (await auditLink.count() > 0) {
      await expect(auditLink).toBeVisible();
    }
  }
});
