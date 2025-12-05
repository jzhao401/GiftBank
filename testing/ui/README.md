# UI/E2E Tests

This directory contains end-to-end UI tests using Playwright for the GiftBank application.

## Structure
```
ui/
├── e2e/
│   ├── auth-flow.spec.js        # Authentication tests
│   └── gift-management.spec.js  # Gift CRUD tests
├── playwright.config.js          # Playwright configuration
└── package.json                  # UI test dependencies
```

## Running UI Tests
```bash
cd testing/ui

# Install dependencies (first time only)
npm install
npx playwright install

# Run all tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/auth-flow.spec.js

# Run in debug mode
npx playwright test --debug

# Generate HTML report
npx playwright show-report
```

## What to Test

UI tests should cover:
1. **Critical user journeys** - Complete workflows from start to finish
2. **Cross-browser compatibility** - Test in Chrome, Firefox, Safari
3. **Visual verification** - Screenshots and visual regression
4. **Real user interactions** - Actual browser automation
5. **Error scenarios** - Network failures, invalid inputs

## Writing UI Tests

### Key Principles
1. **Test from user perspective** - What users see and do
2. **Use stable selectors** - Prefer role, text, label over CSS selectors
3. **Wait for elements** - Use Playwright's auto-waiting
4. **Test realistic scenarios** - Complete user workflows
5. **Verify outcomes** - Check visible results, not implementation

### Example Test Structure
```javascript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app before each test
    await page.goto('http://localhost:3000');
  });
  
  test('user can register and login', async ({ page }) => {
    // Navigate to register page
    await page.click('text=Register');
    
    // Fill registration form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    // Submit form
    await page.click('button:has-text("Register")');
    
    // Verify redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Login with new credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    // Verify successful login
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
  
  test('shows error for invalid credentials', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');
    
    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

## Testing Patterns

### Navigation Testing
```javascript
test('navigates through main pages', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Click navigation links
  await page.click('text=Search');
  await expect(page).toHaveURL(/.*search/);
  
  await page.click('text=Home');
  await expect(page).toHaveURL(/.*\//);
  
  await page.click('text=Profile');
  await expect(page).toHaveURL(/.*profile/);
});
```

### Form Interaction Testing
```javascript
test('creates a new gift', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button:has-text("Login")');
  
  // Navigate to create gift
  await page.click('text=Create Gift');
  
  // Fill gift form
  await page.fill('input[name="name"]', 'Test Gift');
  await page.fill('textarea[name="description"]', 'A test gift description');
  await page.fill('input[name="price"]', '29.99');
  
  // Submit form
  await page.click('button:has-text("Create")');
  
  // Verify success
  await expect(page.locator('text=Gift created successfully')).toBeVisible();
});
```

### Search and Filter Testing
```javascript
test('searches for gifts', async ({ page }) => {
  await page.goto('http://localhost:3000/search');
  
  // Enter search query
  await page.fill('input[placeholder*="Search"]', 'birthday');
  await page.click('button:has-text("Search")');
  
  // Wait for results
  await page.waitForSelector('.gift-card');
  
  // Verify results contain search term
  const results = await page.locator('.gift-card').allTextContents();
  expect(results.some(text => text.toLowerCase().includes('birthday'))).toBeTruthy();
});
```

### Screenshot Testing
```javascript
test('homepage visual regression', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Take screenshot
  await expect(page).toHaveScreenshot('homepage.png');
});

test('mobile responsive design', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000');
  
  // Take mobile screenshot
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});
```

### Network Testing
```javascript
test('handles network errors gracefully', async ({ page }) => {
  // Simulate offline
  await page.route('**/api/**', route => route.abort());
  
  await page.goto('http://localhost:3000');
  
  // Verify error message
  await expect(page.locator('text=Unable to load data')).toBeVisible();
});
```

## Playwright Selectors

### Recommended Selectors (in order of preference)
1. **Text selectors**: `text=Login`, `text=/welcome/i`
2. **Role selectors**: `role=button[name="Submit"]`
3. **Label selectors**: `label=Email`
4. **Placeholder**: `placeholder=Search...`
5. **Test ID**: `data-testid=submit-button` (last resort)

### Selector Examples
```javascript
// Text selector
await page.click('text=Login');

// CSS selector
await page.click('button.submit-btn');

// XPath selector
await page.click('//button[contains(text(), "Submit")]');

// Chaining selectors
await page.locator('form').locator('button').click();

// Filtering
await page.locator('button').filter({ hasText: 'Submit' }).click();
```

## Assertions

### Common Assertions
```javascript
// Visibility
await expect(page.locator('text=Welcome')).toBeVisible();
await expect(page.locator('text=Error')).toBeHidden();

// Text content
await expect(page.locator('h1')).toHaveText('Welcome');
await expect(page.locator('.message')).toContainText('Success');

// URL
await expect(page).toHaveURL('http://localhost:3000/home');
await expect(page).toHaveURL(/.*home/);

// Count
await expect(page.locator('.gift-card')).toHaveCount(5);

// Attributes
await expect(page.locator('input')).toHaveAttribute('type', 'email');

// Screenshots
await expect(page).toHaveScreenshot();
```

## Best Practices

1. **Use auto-waiting** - Playwright waits automatically, avoid manual waits
2. **Stable selectors** - Use text/role over CSS classes
3. **Independent tests** - Each test should work in isolation
4. **Clean state** - Reset database/state between tests
5. **Realistic data** - Use production-like test data
6. **Test critical paths** - Focus on most important user journeys
7. **Cross-browser** - Run tests on multiple browsers
8. **Screenshots on failure** - Automatically captured by Playwright

## Configuration

### Browser Configuration
```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } }
  ]
};
```

### Test Timeout
```javascript
test.setTimeout(30000); // 30 seconds
```

### Retries
```javascript
// playwright.config.js
export default {
  retries: 2 // Retry failed tests
};
```

## Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Headed Mode
```bash
npx playwright test --headed
```

### Slow Motion
```javascript
test.use({ launchOptions: { slowMo: 1000 } });
```

### Trace Viewer
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Install Playwright
  run: |
    cd testing/ui
    npm install
    npx playwright install --with-deps

- name: Run UI Tests
  run: |
    cd testing/ui
    npx playwright test

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: testing/ui/playwright-report/
```

## Common Issues

### Issue: "Timeout waiting for element"
**Solution**: Increase timeout or check selector

### Issue: "Element is not visible"
**Solution**: Wait for element or check if it's hidden by CSS

### Issue: "Navigation failed"
**Solution**: Ensure servers are running, check URL
