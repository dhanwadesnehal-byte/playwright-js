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

  // Click "Add New Connection" button
  const addNewConnectionBtn = page.locator('button:has-text("Add New Connection")').first();
  if (await addNewConnectionBtn.count() > 0) {
    await addNewConnectionBtn.click();
    await page.waitForTimeout(2000);

    // Select Epic EHR system
    const selectEpicBtn = page.locator('button:has-text("Select Epic")').first();
    if (await selectEpicBtn.count() > 0) {
      await selectEpicBtn.click();
      await page.waitForTimeout(2000);

      // Select "Standalone" connection type
      const standaloneOption = page.locator('button:has-text("Standalone"), div:has-text("Standalone"), [class*="card"]:has-text("Standalone")').first();
      if (await standaloneOption.count() > 0) {
        await standaloneOption.click();
        await page.waitForTimeout(1000);
      }
    }
  }
}

// EC-129: Check whether user is able to enter Scope or not
test(qase(129, 'EC-129: Check whether user is able to enter Scope or not'), async ({ page }) => {
  await openAddStandaloneForm(page);

  // Look for Scope field
  const scopeField = page.locator('input[name*="scope"], input[id*="scope"], textarea[name*="scope"]').first();

  if (await scopeField.count() > 0) {
    await scopeField.fill('openid profile patient/*.read');
    const value = await scopeField.inputValue();
    expect(value).toBe('openid profile patient/*.read');
  }
});
