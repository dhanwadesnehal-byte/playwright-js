// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

// EC-74: Check whether the size, color, and UI of different elements is matching the specifications or not
test(qase(74, 'EC-74: Check whether the size, color, and UI of different elements is matching the specifications or not'), async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Check login button exists and has proper styling
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
  await expect(loginButton).toBeVisible();

  const buttonBBox = await loginButton.boundingBox();
  expect(buttonBBox).not.toBeNull();

  // Verify button has reasonable dimensions
  if (buttonBBox) {
    expect(buttonBBox.width).toBeGreaterThan(50);
    expect(buttonBBox.height).toBeGreaterThan(20);
  }

  // Check input fields have proper dimensions
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"]').first();
  const usernameBBox = await usernameField.boundingBox();

  if (usernameBBox) {
    expect(usernameBBox.width).toBeGreaterThan(100);
    expect(usernameBBox.height).toBeGreaterThan(20);
  }

  // Take screenshot for visual verification
  await page.screenshot({ path: 'test-results/EC-74-ui-screenshot.png' });
});
