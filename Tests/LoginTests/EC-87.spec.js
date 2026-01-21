// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-87: Check whether user can enter only numbers in Password field
test(qase(87, 'EC-87: Check whether user can enter only numbers in Password field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Password with only numbers
  const numericPassword = '123456789';

  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(numericPassword);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted numeric-only password
  expect(actualValue).toBe(numericPassword);
});
