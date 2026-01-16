// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';

test.describe('Login Page Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test(qase(1, 'TC001 - Verify user is able to open login page'), async ({ page }) => {
    // Verify the page URL is correct
    await expect(page).toHaveURL(LOGIN_URL);

    // Verify page loads successfully (status 200 or 304)
    const response = await page.goto(LOGIN_URL);
    expect([200, 304]).toContain(response?.status());

    // Verify page has loaded by checking for main content
    await expect(page.locator('body')).toBeVisible();
  });

  test(qase(2, 'TC002 - Verify all login-related elements and fields are present on the login page'), async ({ page }) => {
    // Verify Username/Email field is present
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[id*="user"], input[id*="email"]').first();
    await expect(usernameField).toBeVisible();

    // Verify Password field is present
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();

    // Verify Login/Submit button is present
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In")').first();
    await expect(loginButton).toBeVisible();

    // Verify logo/branding is present (if applicable)
    const logo = page.locator('img[alt*="logo"], img[class*="logo"], .logo, [class*="brand"]').first();
    if (await logo.count() > 0) {
      await expect(logo).toBeVisible();
    }

    // Verify form labels are present
    const labels = page.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);
  });

  test(qase(3, 'TC003 - Verify alignments of displayed elements on the login screen'), async ({ page }) => {
    // Get the login form/container
    const loginForm = page.locator('form, [class*="login"], [class*="auth"]').first();
    await expect(loginForm).toBeVisible();

    // Get bounding boxes of elements to verify alignment
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    const passwordField = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    const usernameBox = await usernameField.boundingBox();
    const passwordBox = await passwordField.boundingBox();
    const buttonBox = await loginButton.boundingBox();

    // Verify elements are present and have dimensions
    expect(usernameBox).not.toBeNull();
    expect(passwordBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    if (usernameBox && passwordBox && buttonBox) {
      // Verify vertical stacking (password field should be below username)
      expect(passwordBox.y).toBeGreaterThan(usernameBox.y);

      // Verify button is below password field
      expect(buttonBox.y).toBeGreaterThan(passwordBox.y);

      // Verify horizontal alignment (elements should be roughly aligned on the left)
      const alignmentTolerance = 50; // Allow 50px tolerance for alignment
      expect(Math.abs(usernameBox.x - passwordBox.x)).toBeLessThan(alignmentTolerance);
    }
  });

  test(qase(4, 'TC004 - Verify size, color, and UI of elements match specifications'), async ({ page }) => {
    // Verify Username field styling
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
    await expect(usernameField).toBeVisible();

    const usernameBox = await usernameField.boundingBox();
    expect(usernameBox).not.toBeNull();
    if (usernameBox) {
      // Verify field has reasonable dimensions
      expect(usernameBox.width).toBeGreaterThan(100);
      expect(usernameBox.height).toBeGreaterThan(20);
    }

    // Verify Password field styling
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();

    const passwordBox = await passwordField.boundingBox();
    expect(passwordBox).not.toBeNull();
    if (passwordBox) {
      expect(passwordBox.width).toBeGreaterThan(100);
      expect(passwordBox.height).toBeGreaterThan(20);
    }

    // Verify Login button styling
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    const buttonBox = await loginButton.boundingBox();
    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      expect(buttonBox.width).toBeGreaterThan(50);
      expect(buttonBox.height).toBeGreaterThan(20);
    }

    // Verify button has appropriate CSS properties
    const buttonStyles = await loginButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        cursor: styles.cursor,
        fontSize: styles.fontSize
      };
    });

    // Verify button has a background color (not transparent)
    expect(buttonStyles.backgroundColor).not.toBe('transparent');
    expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    // Verify cursor is pointer for clickable element
    expect(buttonStyles.cursor).toBe('pointer');
  });

  test(qase(5, 'TC005 - Verify user can see Username and Password fields on the login page'), async ({ page }) => {
    // Verify Username field is visible
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[id*="user"], input[id*="email"]').first();
    await expect(usernameField).toBeVisible();
    await expect(usernameField).toBeEnabled();
    await expect(usernameField).toBeEditable();

    // Verify Username field placeholder or label
    const usernamePlaceholder = await usernameField.getAttribute('placeholder');
    const usernameLabel = page.locator('label[for="username"], label[for="email"], label:has-text("Username"), label:has-text("Email")').first();
    const hasUsernameIndicator = usernamePlaceholder || (await usernameLabel.count()) > 0;
    expect(hasUsernameIndicator).toBeTruthy();

    // Verify Password field is visible
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    await expect(passwordField).toBeEditable();

    // Verify Password field has type="password" for security
    const passwordType = await passwordField.getAttribute('type');
    expect(passwordType).toBe('password');

    // Verify Password field placeholder or label
    const passwordPlaceholder = await passwordField.getAttribute('placeholder');
    const passwordLabel = page.locator('label[for="password"], label:has-text("Password")').first();
    const hasPasswordIndicator = passwordPlaceholder || (await passwordLabel.count()) > 0;
    expect(hasPasswordIndicator).toBeTruthy();

    // Verify both fields can accept input
    await usernameField.fill('testuser');
    await expect(usernameField).toHaveValue('testuser');

    await passwordField.fill('testpassword');
    await expect(passwordField).toHaveValue('testpassword');
  });

  test(qase(6, 'TC006 - Verify login page visual snapshot'), async ({ page }) => {
    // Take a screenshot for visual regression testing
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

});
