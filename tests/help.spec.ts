import { expect, test } from '@playwright/test'

test.describe('Help network demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/help')
    await page.getByRole('button', { name: 'Reset help demo' }).click()
  })

  test('creates an ordinary help request', async ({ page }) => {
    await page.goto('/app/help/new')
    await page.getByLabel('Title').fill('Looking to borrow a USB-C charger')
    await page
      .getByLabel('Description')
      .fill('I need to charge a phone for an hour and can meet near Newton Library.')
    await page.getByRole('button', { name: 'Post request' }).click()

    await expect(page).toHaveURL(/\/app\/help$/)
    await expect(
      page.getByRole('heading', { name: 'Looking to borrow a USB-C charger' }),
    ).toBeVisible()
  })

  test('offers help, accepts a match, and resolves the request', async ({ page }) => {
    const request = page
      .getByRole('article')
      .filter({ hasText: 'Portable charger for tonight' })

    await page.getByLabel('View help board as').selectOption('demo-user-maya')
    await request.getByRole('button', { name: 'I can help' }).click()
    await request
      .getByLabel('How can you help?')
      .fill('I can lend a charger and meet near the library.')
    await request.getByRole('button', { name: 'Send offer' }).click()
    await expect(request.getByText('Your offer is pending')).toBeVisible()

    await page.getByLabel('View help board as').selectOption('demo-user-aisha')
    await expect(request.getByText('1 offer to help')).toBeVisible()
    await request.getByRole('button', { name: 'Accept offer' }).click()
    await expect(request.getByText('Matched', { exact: true })).toBeVisible()

    await request.getByRole('button', { name: 'Mark resolved' }).click()
    await expect(request.getByText('Resolved', { exact: true })).toBeVisible()
  })

  test('confirms and sends a targeted demo beacon', async ({ page }) => {
    await page.goto('/app/beacon/new')
    await page
      .getByLabel('Short explanation')
      .fill('Looking for somewhere to charge a phone for an hour this evening.')
    await page.getByLabel(/Fleetwood/).check()
    await page.getByRole('button', { name: 'Review beacon' }).click()

    await expect(page.getByText('Final confirmation')).toBeVisible()
    await expect(page.getByText('Newton + Fleetwood')).toBeVisible()
    await page.getByRole('button', { name: 'Send to community' }).click()

    await expect(page).toHaveURL(/\/app\/help$/)
    await expect(
      page.getByRole('heading', { name: 'Power or charging help needed' }),
    ).toBeVisible()
  })

  test('synchronizes an offer between two open demo sessions without refresh', async ({
    context,
    page,
  }) => {
    await page.getByLabel('View help board as').selectOption('demo-user-aisha')
    const ownerRequest = page
      .getByRole('article')
      .filter({ hasText: 'Portable charger for tonight' })

    const neighbourPage = await context.newPage()
    await neighbourPage.goto('/app/help')
    await neighbourPage.getByLabel('View help board as').selectOption('demo-user-maya')
    const neighbourRequest = neighbourPage
      .getByRole('article')
      .filter({ hasText: 'Portable charger for tonight' })
    await neighbourRequest.getByRole('button', { name: 'I can help' }).click()
    await neighbourRequest
      .getByLabel('How can you help?')
      .fill('I can bring a charger to a public handoff point.')
    await neighbourRequest.getByRole('button', { name: 'Send offer' }).click()

    await expect(ownerRequest.getByText('1 offer to help')).toBeVisible()
    await expect(page.getByLabel('View help board as')).toHaveValue('demo-user-aisha')
  })
})
