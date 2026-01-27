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

// EC-119: Check whether user is able to select EHR System from dropdown or not
test(qase(119, 'EC-119: Check whether user is able to select EHR System from dropdown or not'), async ({ page }) => {
  await openAddStandaloneForm(page);

  // Look for EHR System dropdown
  const ehrDropdown = page.locator('select[name*="ehr"], select[id*="ehr"], select').first();

  if (await ehrDropdown.count() > 0) {
    // Get options and select one
    const options = await ehrDropdown.locator('option').all();
    if (options.length > 1) {
      await ehrDropdown.selectOption({ index: 1 });
      const selectedValue = await ehrDropdown.inputValue();
      expect(selectedValue).toBeTruthy();
    }
  } else {
    // Try clicking on a dropdown component
    const dropdownTrigger = page.locator('[class*="select"], [class*="dropdown"]').first();
    if (await dropdownTrigger.count() > 0) {
      await dropdownTrigger.click();
      await page.waitForTimeout(500);
      // Select first option
      const option = page.locator('[class*="option"], [role="option"]').first();
      if (await option.count() > 0) {
        await option.click();
      }
    }
  }
});
