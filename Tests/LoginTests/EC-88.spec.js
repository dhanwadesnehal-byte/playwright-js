// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-88: Check whether user can enter password with combination of space in Password field
test(qase(88, 'EC-88: Check whether user can enter password with combination of space in Password field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Password with spaces in between
  const passwordWithSpaces = 'Test Password 123';

  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(passwordWithSpaces);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted password with spaces
  expect(actualValue).toBe(passwordWithSpaces);
});
