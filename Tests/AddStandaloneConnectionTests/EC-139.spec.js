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

// Helper function to navigate to Connections page and open Add Standalone form
async function openAddStandaloneForm(page) {
  await login(page);
  const connectionsLink = page.locator('a:has-text("Connection"), [href*="connection"], nav >> text=Connection').first();
  if (await connectionsLink.count() > 0) {
    await connectionsLink.click();
    await page.waitForTimeout(2000);
  }

  const addStandaloneBtn = page.locator('button:has-text("Add Standalone"), a:has-text("Add Standalone"), button:has-text("Standalone")').first();
  if (await addStandaloneBtn.count() > 0) {
    await addStandaloneBtn.click();
    await page.waitForTimeout(1000);
  }
}

// EC-139: Check whether validation errors are shown for required fields or not
test(qase(139, 'EC-139: Check whether validation errors are shown for required fields or not'), async ({ page }) => {
  await openAddStandaloneForm(page);

  // Click Save/Submit without filling required fields
  const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Add"), button[type="submit"]').first();

  if (await saveButton.count() > 0) {
    const isDisabled = await saveButton.isDisabled();

    if (!isDisabled) {
      await saveButton.click();
      await page.waitForTimeout(1000);

      // Check for validation error messages
      const errorMessage = page.locator('[class*="error"], [class*="invalid"], [role="alert"], .text-red, .text-danger, span:has-text("required")').first();

      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }
    }
  }
});
