import { test, expect } from '@playwright/test'
import { captureConsoleErrors } from './helpers/errors'

/** Wait for the React app shell (present on every page). */
async function waitForApp(page: import('@playwright/test').Page) {
  await page.waitForSelector('[data-testid="app-root"]', { timeout: 15000 })
}

test.describe('Smoke tests', () => {
  test('static landing loads without JS errors', async ({ page }) => {
    const errors = captureConsoleErrors(page)
    await page.goto('/')
    await waitForApp(page)
    await expect(page.getByTestId('static-landing')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('landing carries one title, one description, one canonical', async ({ page }) => {
    // <Seo> (src/pages/index.tsx, values from src/seo.ts) hoists these into
    // <head>. Exactly one of each: index.html ships no static description or
    // canonical, because React 19 would not dedupe against them on mount.
    await page.goto('/')
    await expect(page.getByTestId('static-landing')).toBeVisible()
    await expect(page).toHaveTitle(/\S/)
    expect(await page.locator('head meta[name="description"]').count()).toBe(1)
    expect(await page.locator('head link[rel="canonical"]').count()).toBe(1)
  })

  test('static contract: landing fires no auth request, opens no websocket', async ({ page }) => {
    const offenders: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/api/auth/')) offenders.push(req.url())
    })
    // Only the DO room route counts — vite's own HMR socket is a dev artifact.
    page.on('websocket', (ws) => {
      if (new URL(ws.url()).pathname.startsWith('/ws/')) offenders.push(`ws: ${ws.url()}`)
    })
    await page.goto('/')
    await expect(page.getByTestId('static-landing')).toBeVisible()
    await page.waitForTimeout(1500)
    expect(offenders).toEqual([])
  })

  test('mobile dashboard is usable and routes work', async ({ page }) => {
    const errors = captureConsoleErrors(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/app')
    await waitForApp(page)
    await expect(page.getByRole('heading', { name: 'Good evening, Maya' })).toBeVisible()
    await expect(page.getByText('Newton, Surrey').first()).toBeVisible()
    await expect(page.getByText('SIMULATED SCENARIO')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()

    await page.getByRole('link', { name: 'Communities' }).last().click()
    await expect(page).toHaveURL(/\/app\/communities$/)
    await expect(page.getByRole('heading', { name: 'Your nearby communities' })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('desktop dashboard exposes primary navigation and working CTAs', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/app')
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await page.getByRole('link', { name: 'Ask for help' }).click()
    await expect(page).toHaveURL(/\/app\/help\/new$/)
    await expect(page.getByRole('heading', { name: 'Create a help request' })).toBeVisible()
  })

  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz')
    await waitForApp(page)
    await expect(page.locator('text=404')).toBeVisible()
  })
})
