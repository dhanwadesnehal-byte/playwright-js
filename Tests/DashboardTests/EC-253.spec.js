// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';
const VALID_PASSWORD = 'Mindbowser@123';

// Helper function to login
async function login(page) {
  await page.goto(LOGIN_URL);
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  const passwordField = page.locator('input[type="password"]');
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

  await usernameField.fill(VALID_USERNAME);
  await passwordField.fill(VALID_PASSWORD);
  await loginButton.click();
  await page.waitForTimeout(3000);
}

// EC-253: Check whether user is able to land on Dashboard page after login
test(qase(253, 'EC-253: Check whether user is able to land on Dashboard page after login'), async ({ page }) => {
  await login(page);

  // Verify user lands on dashboard or home page after login
  const currentUrl = page.url();
  const isDashboard = currentUrl.includes('dashboard') || currentUrl.includes('home') || !currentUrl.includes('login');
  expect(isDashboard).toBeTruthy();
});
