// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-73: Check whether the alignments of displayed elements on the login screen is proper or not
test(qase(73, 'EC-73: Check whether the alignments of displayed elements on the login screen is proper or not'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Get username field bounding box
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  const usernameBBox = await usernameField.boundingBox();

  // Get password field bounding box
  const passwordField = page.locator('input[type="password"]').first();
  const passwordBBox = await passwordField.boundingBox();

  // Verify both fields exist
  expect(usernameBBox).not.toBeNull();
  expect(passwordBBox).not.toBeNull();

  // Check vertical alignment (password should be below username)
  if (usernameBBox && passwordBBox) {
    expect(passwordBBox.y).toBeGreaterThan(usernameBBox.y);
  }

  // Check horizontal alignment (fields should be roughly aligned)
  if (usernameBBox && passwordBBox) {
    const xDifference = Math.abs(usernameBBox.x - passwordBBox.x);
    expect(xDifference).toBeLessThan(50); // Allow 50px tolerance
  }
});
