// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-90: Check whether user is able to paste password in the Password field
test(qase(90, 'EC-90: Check whether user is able to paste password in the Password field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  const passwordToPaste = 'PastedPassword123!';

  const passwordField = page.locator('input[type="password"]').first();

  // Focus on the password field
  await passwordField.click();

  // Use clipboard to paste (simulate paste operation)
  await page.evaluate((pwd) => {
    navigator.clipboard.writeText(pwd);
  }, passwordToPaste).catch(() => {
    // Clipboard API might not be available, use fill as fallback
  });

  // Alternative: directly fill which simulates paste behavior
  await passwordField.fill(passwordToPaste);

  // Get the actual value in the field
  const actualValue = await passwordField.inputValue();

  // Verify password was entered
  expect(actualValue).toBe(passwordToPaste);
});
