// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';
const VALID_PASSWORD = 'Mindbowser@123';

// EC-76: Check whether user is able to enter valid Username and valid password and login or not
test(qase(76, 'EC-76: Check whether user is able to enter valid Username and valid password and login or not'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Enter valid username
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  await usernameField.fill(VALID_USERNAME);

  // Enter valid password
  const passwordField = page.locator('input[type="password"]').first();
  await passwordField.fill(VALID_PASSWORD);

  // Click login button
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await loginButton.click();

  // Wait for navigation after successful login
  await page.waitForTimeout(3000);

  // Verify user is redirected away from login page (successful login)
  const currentUrl = page.url();
  expect(currentUrl).not.toBe(LOGIN_URL);
});
