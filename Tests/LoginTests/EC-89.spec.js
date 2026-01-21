// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-89: Check whether user can enter password starting with space in Password field
test(qase(89, 'EC-89: Check whether user can enter password starting with space in Password field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Password starting with space
  const passwordStartingWithSpace = ' TestPassword123';

  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(passwordStartingWithSpace);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify field accepted password starting with space
  expect(actualValue).toBe(passwordStartingWithSpace);
});
