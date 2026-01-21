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

// EC-130: Check whether user is able to see Private Key field or not
test(qase(130, 'EC-130: Check whether user is able to see Private Key field or not'), async ({ page }) => {
  await openAddStandaloneForm(page);

  // Look for Private Key field
  const privateKeyField = page.locator('textarea[name*="private"], textarea[id*="private"], textarea[name*="key"], input[name*="privateKey"], label:has-text("Private Key") + textarea, label:has-text("Private Key") + input').first();

  if (await privateKeyField.count() > 0) {
    await expect(privateKeyField).toBeVisible();
  } else {
    // Check for Private Key label
    const privateKeyLabel = page.locator('label:has-text("Private Key"), text=Private Key').first();
    await expect(privateKeyLabel).toBeVisible();
  }
});
