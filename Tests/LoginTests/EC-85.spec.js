// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-85: Check whether user can enter characters less than specified range in Password field
test(qase(85, 'EC-85: Check whether user can enter characters less than specified range in Password field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Enter a short password (less than typical minimum)
  const shortPassword = 'Ab1';

  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(shortPassword);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted the short input
  expect(actualValue).toBe(shortPassword);
  expect(actualValue.length).toBe(3);
});
