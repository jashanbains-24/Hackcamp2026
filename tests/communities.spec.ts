import { test, expect } from '@playwright/test'

test.describe('Communities', () => {
  test('discovers communities and supports join plus home selection', async ({ page }) => {
    await page.goto('/app/communities')
    await expect(page.getByRole('heading', { name: 'Communities' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Cloverdale' })).toBeVisible()

    await page.getByRole('link', { name: 'Fleetwood' }).click()
    await expect(page.getByRole('heading', { name: 'Fleetwood' })).toBeVisible()
    await page.getByRole('button', { name: 'Join community' }).click()
    await expect(page.getByRole('button', { name: 'Make home community' })).toBeVisible()
    await page.getByRole('button', { name: 'Make home community' }).click()
    await expect(page.getByText('Home community')).toBeVisible()
  })

  test('approved Newton members can create a post and one-level comment', async ({ page }) => {
    await page.goto('/app/communities/newton')
    await page.getByRole('button', { name: 'New post' }).click()
    await page.getByLabel('Title').fill('Neighbour test post')
    await page.getByLabel('What would you like neighbours to know?').fill('A useful local update for the demo.')
    await page.getByRole('button', { name: 'Publish post' }).click()
    await expect(page.getByRole('heading', { name: 'Neighbour test post' })).toBeVisible()

    const postLink = page.getByRole('link', { name: /Neighbour test post/ })
    await page.goto(await postLink.getAttribute('href') as string)
    await expect(page.getByRole('heading', { name: 'Neighbour test post' })).toBeVisible()
    await page.getByLabel('Add a comment').fill('Thanks for the useful update.')
    await page.getByRole('button', { name: 'Post comment' }).click()
    await expect(page.getByText('Thanks for the useful update.')).toBeVisible()
  })

  test('request-to-join communities keep publishing disabled while pending', async ({ page }) => {
    await page.goto('/app/communities/guildford')
    await expect(page.getByRole('button', { name: 'Request to join' })).toBeVisible()
    await page.getByRole('button', { name: 'Request to join' }).click()
    await expect(page.getByText('Request pending')).toBeVisible()
    await expect(page.getByRole('button', { name: 'New post' })).toBeDisabled()
  })
})
