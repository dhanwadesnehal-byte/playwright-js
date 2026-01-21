// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-86: Check whether user can enter password with combination of special characters
test(qase(86, 'EC-86: Check whether user can enter password with combination of special characters'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Password with special characters
  const specialPassword = 'Test@#$%^&*()!123';

  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(specialPassword);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted special characters
  expect(actualValue).toBe(specialPassword);
});
