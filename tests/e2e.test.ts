import { test as base, expect, Page } from '@playwright/test';

// Extend the test context to include auth state
type TestFixtures = {
  authedPage: Page;
};

const test = base.extend<TestFixtures>({
  authedPage: async ({ page }, use) => {
    // Set up auth state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('clerk-db', JSON.stringify({
        auth: {
          token: 'test_token',
          exp: Date.now() + 3600000
        }
      }));
    });
    await use(page);
  },
});

// Authentication Tests
test.describe('Authentication', () => {
  test('should redirect to login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show auth components', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByText('Sign in')).toBeVisible();
  });
});

// Document Tests
test.describe('Document Operations', () => {
  test('should create a new document', async ({ authedPage: page }) => {
    await page.goto('/documents');
    await page.getByRole('button', { name: 'New Document' }).click();
    await expect(page.getByText('Untitled document')).toBeVisible();
  });

  test('should have working real-time collaboration', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Set up auth for both users
    for (const page of [page1, page2]) {
      await page.evaluate(() => {
        localStorage.setItem('clerk-db', JSON.stringify({
          auth: {
            token: 'test_token',
            exp: Date.now() + 3600000
          }
        }));
      });
    }

    await page1.goto('/documents/test-doc');
    await page2.goto('/documents/test-doc');

    await page1.locator('.tiptap').click();
    await page1.keyboard.type('Hello from user 1');

    await expect(page2.getByText('Hello from user 1')).toBeVisible();
  });
});

// Editor Features Tests
test.describe('Editor Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documents/test-doc');
  });

  test('should format text correctly', async ({ page }) => {
    await page.locator('.tiptap').click();
    await page.keyboard.type('Test text');
    await page.keyboard.press('Control+a');
    await page.click('button:has-text("B")'); // Bold button
    
    const isBold = await page.evaluate(() => {
      const text = document.querySelector('.tiptap strong');
      return !!text;
    });
    expect(isBold).toBeTruthy();
  });

  test('should handle images', async ({ page }) => {
    await page.setInputFiles('input[type="file"]', 'test-image.png');
    await expect(page.locator('img')).toBeVisible();
  });

  test('should create tables', async ({ page }) => {
    await page.click('[data-testid="insert-table"]');
    await expect(page.locator('table')).toBeVisible();
  });
});

// Liveblocks Tests
test.describe('Liveblocks Features', () => {
  test('should show presence indicators', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('/documents/test-doc');
    await page2.goto('/documents/test-doc');

    // Check if presence indicators are visible
    await expect(page1.locator('.presence-indicator')).toBeVisible();
    await expect(page2.locator('.presence-indicator')).toBeVisible();
  });

  test('should handle comments', async ({ page }) => {
    await page.goto('/documents/test-doc');
    await page.click('[data-testid="add-comment"]');
    await page.keyboard.type('Test comment');
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator('text=Test comment')).toBeVisible();
  });
});

// Performance Tests
test.describe('Performance', () => {
  test('should load document within 3 seconds', async ({ authedPage: page }) => {
    const startTime = Date.now();
    await page.goto('/documents/test-doc');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large documents', async ({ authedPage: page }) => {
    await page.goto('/documents/test-doc');
    await page.locator('.tiptap').click();
    
    // Type a large amount of text
    for (let i = 0; i < 1000; i++) {
      await page.keyboard.type('Test content ');
    }
    
    // Check if editor remains responsive
    const responseTime = await page.evaluate(async () => {
      const start = performance.now();
      document.querySelector('.tiptap')?.dispatchEvent(new Event('input'));
      return performance.now() - start;
    });
    
    expect(responseTime).toBeLessThan(100);
  });
});

// Error Handling Tests
test.describe('Error Handling', () => {
  test('should handle network disconnection gracefully', async ({ authedPage: page, context }) => {
    await page.goto('/documents/test-doc');
    await context.setOffline(true);
    
    await page.locator('.tiptap').click();
    await page.keyboard.type('Offline change');
    
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
    
    await context.setOffline(false);
    await expect(page.getByText('Offline change')).toBeVisible();
  });

  test('should handle auth errors appropriately', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('clerk-db', JSON.stringify({
        auth: {
          token: 'invalid_token',
          exp: Date.now() - 1000
        }
      }));
    });
    
    await page.goto('/documents/test-doc');
    await expect(page.getByText('Authentication failed')).toBeVisible();
  });
});

// Environment Checks
test.describe('Environment Checks', () => {
  test('should load correct environment variables', async ({ authedPage: page }) => {
    const isProd = process.env.NODE_ENV === 'production';
    await page.goto('/api/health');
    const response = await page.textContent('body');
    const health = JSON.parse(response || '{}');
    
    expect(health.environment).toBe(isProd ? 'production' : 'test');
    expect(health.services.convex).toBe('healthy');
    expect(health.services.liveblocks).toBe('healthy');
    expect(health.services.clerk).toBe('healthy');
  });
}); 