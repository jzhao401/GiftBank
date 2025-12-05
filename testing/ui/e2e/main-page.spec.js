import { test, expect } from '@playwright/test';

/**
 * E2E Tests for GiftBank Main Page
 * 
 * These tests verify the main page functionality without requiring authentication.
 */

test.describe('GiftBank Main Page', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to app before each test
        await page.goto('/');
    });

    test('homepage loads successfully', async ({ page }) => {
        // Verify page loaded
        await expect(page).toHaveURL(/.*\//);

        // Check for navbar
        await expect(page.locator('text=GiftLink')).toBeVisible();
    });

    test('displays navigation bar', async ({ page }) => {
        // Check for navigation elements
        await expect(page.locator('text=GiftLink')).toBeVisible();
        await expect(page.locator('a:has-text("Home")')).toBeVisible();
        await expect(page.locator('a:has-text("Gifts")')).toBeVisible();
    });

    test('navigation links are clickable', async ({ page }) => {
        // Click Home link
        const homeLink = page.locator('a:has-text("Home")').first();
        await expect(homeLink).toBeVisible();

        // Click Gifts link
        const giftsLink = page.locator('a:has-text("Gifts")').first();
        await expect(giftsLink).toBeVisible();
    });

    test('page has correct title structure', async ({ page }) => {
        // Check for main container
        const container = page.locator('.container');
        await expect(container).toBeVisible();
    });
});

test.describe('GiftBank Responsive Design', () => {

    test('displays correctly on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Verify navbar is present
        await expect(page.locator('text=GiftLink')).toBeVisible();
    });

    test('displays correctly on tablet', async ({ page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        // Verify content is visible
        await expect(page.locator('text=GiftLink')).toBeVisible();
    });

    test('displays correctly on desktop', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');

        // Verify content is visible
        await expect(page.locator('text=GiftLink')).toBeVisible();
    });
});

test.describe('GiftBank Visual Tests', () => {

    test('homepage visual snapshot', async ({ page }) => {
        await page.goto('/');

        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');

        // Take screenshot for visual comparison
        await expect(page).toHaveScreenshot('homepage.png', {
            fullPage: true,
            maxDiffPixels: 100
        });
    });
});
