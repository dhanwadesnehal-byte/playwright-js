// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-83: Check whether the data in password field is visible as asterisk or bullet signs
test(qase(83, 'EC-83: Check whether the data in password field is visible as asterisk or bullet signs'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Find password field
  const passwordField = page.locator('input[type="password"]').first();
  await expect(passwordField).toBeVisible();

  // Enter password
  await passwordField.fill('TestPassword123');

  // Verify the input type is still "password" (which masks the characters)
  const inputType = await passwordField.getAttribute('type');
  expect(inputType).toBe('password');

  // Verify the value is entered but not visible as plain text
  const value = await passwordField.inputValue();
  expect(value).toBe('TestPassword123');
});
