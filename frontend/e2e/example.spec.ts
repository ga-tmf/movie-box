import { test, expect } from '@playwright/test'

test('homepage has title and links', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Movie Box' })).toBeVisible()

  await expect(page.getByRole('link', { name: 'Add Movie' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
})

test('can navigate to about page', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'About' }).click()

  await expect(
    page.getByRole('heading', { name: 'About Movie Box' })
  ).toBeVisible()
})
