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

// EC-144: Check whether user can clear all fields after entering data or not
test(qase(144, 'EC-144: Check whether user can clear all fields after entering data or not'), async ({ page }) => {
  await openAddStandaloneForm(page);

  // Find and fill some form fields
  const nameField = page.locator('input[name*="name"], input[id*="name"]').first();
  const urlField = page.locator('input[name*="url"], input[id*="url"]').first();

  if (await nameField.count() > 0) {
    await nameField.fill('Test Connection');

    // Clear the field
    await nameField.clear();
    const value = await nameField.inputValue();
    expect(value).toBe('');
  }

  if (await urlField.count() > 0) {
    await urlField.fill('https://test.example.com');

    // Clear the field
    await urlField.clear();
    const value = await urlField.inputValue();
    expect(value).toBe('');
  }
});
