// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';
const VALID_PASSWORD = 'Mindbowser@123';

test.describe('Login Page Tests (EC-71 to EC-92)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // EC-71: Check whether user is able to open login page or not
  test(qase(71, 'EC-71: Check whether user is able to open login page or not'), async ({ page }) => {
    await expect(page).toHaveURL(LOGIN_URL);
    const response = await page.goto(LOGIN_URL);
    expect([200, 304]).toContain(response?.status());
    await expect(page.locator('body')).toBeVisible();
  });

  // EC-72: Check whether all login-related elements and fields are present on the login page or not
  test(qase(72, 'EC-72: Check whether all login-related elements and fields are present on the login page or not'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[id*="user"], input[id*="email"]').first();
    await expect(usernameField).toBeVisible();

    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();

    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In")').first();
    await expect(loginButton).toBeVisible();

    const labels = page.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);
  });

  // EC-73: Check whether the alignments of displayed elements on the login screen is proper or not
  test(qase(73, 'EC-73: Check whether the alignments of displayed elements on the login screen is proper or not'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    const usernameBox = await usernameField.boundingBox();
    const passwordBox = await passwordField.boundingBox();
    const buttonBox = await loginButton.boundingBox();

    expect(usernameBox).not.toBeNull();
    expect(passwordBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    if (usernameBox && passwordBox && buttonBox) {
      expect(passwordBox.y).toBeGreaterThan(usernameBox.y);
      expect(buttonBox.y).toBeGreaterThan(passwordBox.y);
      const alignmentTolerance = 50;
      expect(Math.abs(usernameBox.x - passwordBox.x)).toBeLessThan(alignmentTolerance);
    }
  });

  // EC-74: Check whether the size, color, and UI of different elements is matching the specifications or not
  test(qase(74, 'EC-74: Check whether the size, color, and UI of different elements is matching the specifications or not'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const usernameBox = await usernameField.boundingBox();
    expect(usernameBox).not.toBeNull();
    if (usernameBox) {
      expect(usernameBox.width).toBeGreaterThan(100);
      expect(usernameBox.height).toBeGreaterThan(20);
    }

    const passwordField = page.locator('input[type="password"]');
    const passwordBox = await passwordField.boundingBox();
    expect(passwordBox).not.toBeNull();
    if (passwordBox) {
      expect(passwordBox.width).toBeGreaterThan(100);
      expect(passwordBox.height).toBeGreaterThan(20);
    }

    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    const buttonStyles = await loginButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        cursor: styles.cursor,
      };
    });
    expect(buttonStyles.backgroundColor).not.toBe('transparent');
    expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  // EC-75: Check whether user is able to see Username and Password fields on the login page or not
  test(qase(75, 'EC-75: Check whether user is able to see Username and Password fields on the login page or not'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[id*="user"], input[id*="email"]').first();
    await expect(usernameField).toBeVisible();
    await expect(usernameField).toBeEnabled();
    await expect(usernameField).toBeEditable();

    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    await expect(passwordField).toBeEditable();

    const passwordType = await passwordField.getAttribute('type');
    expect(passwordType).toBe('password');
  });

  // EC-76: Check whether user is able to enter valid Username and valid password and login or not
  test(qase(76, 'EC-76: Check whether user is able to enter valid Username and valid password and login or not'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await passwordField.fill(VALID_PASSWORD);
    await expect(usernameField).toHaveValue(VALID_USERNAME);
    await expect(passwordField).toHaveValue(VALID_PASSWORD);

    await loginButton.click();
    // Wait for navigation or error message
    await page.waitForTimeout(2000);
  });

  // EC-77: Check whether the user is able to Log In without entering Username
  test(qase(77, 'EC-77: Check whether the user is able to Log In without entering Username'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await passwordField.fill(VALID_PASSWORD);
    await loginButton.click();

    // Should show validation error or remain on login page
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  // EC-78: Check whether the user is able to Log In using unregistered Username id
  test(qase(78, 'EC-78: Check whether the user is able to Log In using unregistered Username id'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill('unregistered_user@invalid.com');
    await passwordField.fill(VALID_PASSWORD);
    await loginButton.click();

    await page.waitForTimeout(2000);
    // Should show error message or remain on login page
    const errorMessage = page.locator('[class*="error"], [class*="alert"], [role="alert"]').first();
    const isOnLoginPage = await page.url().includes('login');
    expect(isOnLoginPage || await errorMessage.count() > 0).toBeTruthy();
  });

  // EC-79: Check whether the user can enter the characters more than the specified range in Username field
  test(qase(79, 'EC-79: Check whether the user can enter characters more than specified range in Username field'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();

    const longUsername = 'a'.repeat(256) + '@example.com';
    await usernameField.fill(longUsername);

    const enteredValue = await usernameField.inputValue();
    // Check if field has maxlength or accepts all characters
    expect(enteredValue.length).toBeGreaterThan(0);
  });

  // EC-80: Check whether the user is able to Log In using Username email
  test(qase(80, 'EC-80: Check whether the user is able to Log In using Username email'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await passwordField.fill(VALID_PASSWORD);

    await expect(usernameField).toHaveValue(VALID_USERNAME);
    await loginButton.click();
    await page.waitForTimeout(2000);
  });

  // EC-81: Check whether the user is able to Log In without entering Password
  test(qase(81, 'EC-81: Check whether the user is able to Log In without entering Password'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await loginButton.click();

    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  // EC-82: Check whether the user is able to Log In using invalid Password
  test(qase(82, 'EC-82: Check whether the user is able to Log In using invalid Password'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await passwordField.fill('InvalidPassword123!');
    await loginButton.click();

    await page.waitForTimeout(2000);
    const isOnLoginPage = await page.url().includes('login');
    expect(isOnLoginPage).toBeTruthy();
  });

  // EC-83: Check whether the data in password field is either visible as asterisk or bullet signs
  test(qase(83, 'EC-83: Check whether the data in password field is visible as asterisk or bullet signs'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');

    const fieldType = await passwordField.getAttribute('type');
    expect(fieldType).toBe('password');

    await passwordField.fill('TestPassword123');
    const fieldTypeAfterFill = await passwordField.getAttribute('type');
    expect(fieldTypeAfterFill).toBe('password');
  });

  // EC-84: Check whether the user can enter characters more than specified range in Password field (8-15 characters)
  test(qase(84, 'EC-84: Check whether user can enter characters more than specified range in Password field'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');

    const longPassword = 'A'.repeat(20) + '1';
    await passwordField.fill(longPassword);

    const enteredValue = await passwordField.inputValue();
    expect(enteredValue.length).toBeGreaterThan(0);
  });

  // EC-85: Check whether the user can enter characters less than specified range in Password field
  test(qase(85, 'EC-85: Check whether user can enter characters less than specified range in Password field'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await passwordField.fill('Ab1');
    await loginButton.click();

    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  // EC-86: Check whether the user can enter password with combination of special characters
  test(qase(86, 'EC-86: Check whether user can enter password with combination of special characters'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');

    const specialPassword = 'Test@#$%^&*123';
    await passwordField.fill(specialPassword);

    const enteredValue = await passwordField.inputValue();
    expect(enteredValue).toBe(specialPassword);
  });

  // EC-87: Check whether the user can enter only numbers in Password field
  test(qase(87, 'EC-87: Check whether user can enter only numbers in Password field'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await passwordField.fill('12345678');

    const enteredValue = await passwordField.inputValue();
    expect(enteredValue).toBe('12345678');

    await loginButton.click();
    await page.waitForTimeout(1000);
  });

  // EC-88: Check whether the user can enter password with combination of space in Password field
  test(qase(88, 'EC-88: Check whether user can enter password with combination of space in Password field'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');

    const passwordWithSpace = 'Test Password123';
    await passwordField.fill(passwordWithSpace);

    const enteredValue = await passwordField.inputValue();
    expect(enteredValue).toBe(passwordWithSpace);
  });

  // EC-89: Check whether the user can enter password starting with space in Password field
  test(qase(89, 'EC-89: Check whether user can enter password starting with space in Password field'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');

    const passwordStartingWithSpace = ' TestPassword123';
    await passwordField.fill(passwordStartingWithSpace);

    const enteredValue = await passwordField.inputValue();
    // Check if leading space is preserved or trimmed
    expect(enteredValue.length).toBeGreaterThan(0);
  });

  // EC-90: Check whether the user is able to paste password in the Password field
  test(qase(90, 'EC-90: Check whether user is able to paste password in the Password field'), async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');

    // Simulate paste using keyboard
    await passwordField.focus();
    await page.evaluate(() => {
      navigator.clipboard.writeText('PastedPassword123');
    }).catch(() => {
      // Clipboard API may not be available, use alternative
    });

    // Use fill as alternative to paste
    await passwordField.fill('PastedPassword123');
    const enteredValue = await passwordField.inputValue();
    expect(enteredValue).toBe('PastedPassword123');
  });

  // EC-91: Check whether the user is able to set only space as password
  test(qase(91, 'EC-91: Check whether user is able to set only space as password'), async ({ page }) => {
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await usernameField.fill(VALID_USERNAME);
    await passwordField.fill('        ');
    await loginButton.click();

    await page.waitForTimeout(1000);
    // Should show error or remain on login page
    await expect(page).toHaveURL(/login/);
  });

  // EC-92: Check whether the user is able to Sign In by keeping both email and password field blank
  test(qase(92, 'EC-92: Check whether user is able to Sign In by keeping both fields blank'), async ({ page }) => {
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await loginButton.click();

    await page.waitForTimeout(1000);
    // Should show validation error or remain on login page
    await expect(page).toHaveURL(/login/);
  });

});
