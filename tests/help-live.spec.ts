import { expect, loadAllTestAccounts, test } from 'deepspace/testing'

const usableTestAccounts = loadAllTestAccounts().length
test.skip(
  usableTestAccounts < 2,
  `Needs 2 usable DeepSpace test accounts, found ${usableTestAccounts}.`,
)

test('authenticated neighbours complete the help lifecycle without refresh', async ({ users }) => {
  test.setTimeout(90_000)
  const [requester, responder] = await users(2)
  const title = `Live charger request ${Date.now().toString(36)}`

  await Promise.all([
    requester.page.goto('/app/help'),
    responder.page.goto('/app/help'),
  ])

  for (const participant of [requester, responder]) {
    await expect(participant.page.getByText(/Signed in as/)).toBeVisible({
      timeout: 15_000,
    })
  }

  const tokenCheck = await requester.page.evaluate(async () => {
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const body = await response.json().catch(() => ({})) as { token?: string }
    return { status: response.status, hasToken: Boolean(body.token) }
  })
  expect(tokenCheck).toEqual({ status: 200, hasToken: true })

  await requester.page.goto('/app/help/new')
  await requester.page.getByLabel('Title').fill(title)
  await requester.page
    .getByLabel('Description')
    .fill('Looking to borrow a USB-C charger for an hour near a safe public meeting place.')
  const createResponsePromise = requester.page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/actions/createHelpItem') &&
      response.request().method() === 'POST',
  )
  await requester.page.getByRole('button', { name: 'Post request' }).click()
  const createResponse = await createResponsePromise
  const createPayload = await createResponse.json() as {
    success?: boolean
    error?: string
  }
  if (!createPayload.success) {
    throw new Error(`createHelpItem failed: ${createPayload.error ?? 'unknown error'}`)
  }

  await expect(requester.page).toHaveURL(/\/app\/help$/, { timeout: 15_000 })
  const requesterItem = requester.page.getByRole('article').filter({ hasText: title })
  const responderItem = responder.page.getByRole('article').filter({ hasText: title })
  await expect(requesterItem).toBeVisible()
  await expect(responderItem).toBeVisible({ timeout: 15_000 })

  await responderItem.getByRole('button', { name: 'I can help' }).click()
  await responderItem
    .getByLabel('How can you help?')
    .fill('I can lend a charger and meet near the library.')
  await responderItem.getByRole('button', { name: 'Send offer' }).click()

  await expect(requesterItem.getByText('1 offer to help')).toBeVisible({
    timeout: 15_000,
  })
  await requesterItem.getByRole('button', { name: 'Accept offer' }).click()

  await expect(requesterItem.getByText('Matched', { exact: true })).toBeVisible({
    timeout: 15_000,
  })
  await expect(responderItem.getByText('Matched', { exact: true })).toBeVisible({
    timeout: 15_000,
  })

  await requesterItem.getByRole('button', { name: 'Mark resolved' }).click()
  await expect(requesterItem.getByText('Resolved', { exact: true })).toBeVisible({
    timeout: 15_000,
  })
  await expect(responderItem.getByText('Resolved', { exact: true })).toBeVisible({
    timeout: 15_000,
  })
})
