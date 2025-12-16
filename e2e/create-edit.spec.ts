import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'blog_admin_blogs';

const sampleBlog = {
  id: 'test-blog-1',
  title: 'E2E Test Blog',
  description: 'This is a test blog',
  category: 'Testing',
  author: 'E2E Tester',
  image: null,
  publishDate: new Date().toISOString().split('T')[0],
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
};

test('create/edit smoke (via localStorage seed + UI edit)', async ({ page }) => {
  // Seed localStorage with a blog
  await page.addInitScript((blog) => {
    localStorage.setItem('blog_admin_blogs', JSON.stringify([blog]));
  }, sampleBlog);

  // Go to blogs list and verify the seeded blog appears
  await page.goto('/blogs');
  await expect(page.locator('h3', { hasText: sampleBlog.title })).toBeVisible();

  // Click edit for that blog
  const cardTitle = page.locator('h3', { hasText: sampleBlog.title });
  const card = cardTitle.locator('..').locator('..');
  await card.locator('a:has-text("Edit")').click();

  // We should be on the editor page for that blog
  await expect(page).toHaveURL(/\/blogs\/test-blog-1/);

  // Change the title
  const newTitle = 'E2E Updated Title';
  await page.fill('#title', newTitle);

  // Click Save Changes
  await page.click('button:has-text("Save Changes")');

  // Back to blogs list and verify updated title
  await page.goto('/blogs');
  await expect(page.locator('h3', { hasText: newTitle })).toBeVisible();
});
