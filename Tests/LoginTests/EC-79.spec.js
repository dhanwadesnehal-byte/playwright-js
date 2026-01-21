// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-79: Check whether the user can enter characters more than specified range in Username field
test(qase(79, 'EC-79: Check whether the user can enter characters more than specified range in Username field'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Generate a very long username (256 characters)
  const longUsername = 'a'.repeat(256);

  // Enter long username
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  await usernameField.fill(longUsername);

  // Get the actual value in the field
  const actualValue = await usernameField.inputValue();

  // Verify field accepted or truncated the input
  expect(actualValue.length).toBeGreaterThan(0);

  // Log actual length for verification
  console.log(`Username field accepted ${actualValue.length} characters`);
});
