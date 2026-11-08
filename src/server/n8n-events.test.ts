import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildHelpRequestEvent, notifyHelpRequestCreated } from './n8n-events'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('n8n help events', () => {
  it('keeps the payload anonymous and replay-safe', () => {
    expect(buildHelpRequestEvent({
      eventId: 'help-1',
      category: 'supplies',
      communityName: ' Newton ',
      municipality: 'Surrey',
      createdAt: '2026-11-07T00:00:00.000Z',
    })).toEqual({
      eventId: 'help-1',
      eventType: 'help_request_created',
      category: 'supplies',
      communityName: 'Newton',
      municipality: 'Surrey',
      createdAt: '2026-11-07T00:00:00.000Z',
    })
  })

  it('sends only the anonymous event with the header token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await notifyHelpRequestCreated(
      {
        N8N_WEBHOOK_URL: 'https://example.test/webhook/neighbourgrid-help',
        N8N_WEBHOOK_TOKEN: 'test-token',
      },
      buildHelpRequestEvent({
        eventId: 'help-1',
        category: 'supplies',
        createdAt: '2026-11-07T00:00:00.000Z',
      }),
    )

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://example.test/webhook/neighbourgrid-help')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      'x-neighbourgrid-token': 'test-token',
    })
    expect(JSON.parse(String(init.body))).toEqual({
      eventId: 'help-1',
      eventType: 'help_request_created',
      category: 'supplies',
      communityName: null,
      municipality: null,
      createdAt: '2026-11-07T00:00:00.000Z',
    })
    expect(String(init.body)).not.toContain('description')
    expect(String(init.body)).not.toContain('author')
  })

  it('does nothing when the webhook is not configured', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await notifyHelpRequestCreated({}, buildHelpRequestEvent({
      eventId: 'help-1',
      category: 'other',
      createdAt: '2026-11-07T00:00:00.000Z',
    }))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('keeps help creation independent of a webhook failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(notifyHelpRequestCreated(
      {
        N8N_WEBHOOK_URL: 'https://example.test/webhook/neighbourgrid-help',
        N8N_WEBHOOK_TOKEN: 'test-token',
      },
      buildHelpRequestEvent({
        eventId: 'help-1',
        category: 'other',
        createdAt: '2026-11-07T00:00:00.000Z',
      }),
    )).resolves.toBeUndefined()
  })
})
