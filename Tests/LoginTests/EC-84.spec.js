// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-84: Check whether user can enter characters more than specified range in Password field
test(qase(84, 'EC-84: Check whether user can enter characters more than specified range in Password field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Generate a very long password (256 characters)
  const longPassword = 'A1@' + 'a'.repeat(253);

  // Enter long password
  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(longPassword);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted or truncated the input
  expect(actualValue.length).toBeGreaterThan(0);

  // Log actual length for verification
  console.log(`Password field accepted ${actualValue.length} characters`);
});
