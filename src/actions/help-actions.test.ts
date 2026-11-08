import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ActionTools } from 'deepspace/worker'
import type { Env } from '../../worker'
import {
  acceptHelpResponseAction,
  createHelpBeaconAction,
  createHelpItemAction,
  respondToHelpItemAction,
} from './help-actions'

type StoredRecord = {
  recordId: string
  data: Record<string, unknown>
}

function makeTools(seed: Record<string, StoredRecord[]>) {
  const records = structuredClone(seed)
  let nextId = 0

  const tools = {
    get: vi.fn(async (collection: string, recordId: string) => {
      const record = records[collection]?.find((candidate) => candidate.recordId === recordId)
      return record
        ? { success: true as const, data: { record } }
        : { success: false as const, error: 'Not found' }
    }),
    query: vi.fn(async (
      collection: string,
      options?: { where?: Record<string, unknown>; orderBy?: string; orderDir?: string; limit?: number },
    ) => {
      let found = [...(records[collection] ?? [])]
      if (options?.where) {
        found = found.filter((record) =>
          Object.entries(options.where!).every(([key, value]) => record.data[key] === value),
        )
      }
      if (options?.orderBy) {
        const key = options.orderBy
        found.sort((a, b) =>
          String(a.data[key]).localeCompare(String(b.data[key])) *
          (options.orderDir === 'desc' ? -1 : 1),
        )
      }
      return {
        success: true as const,
        data: { records: found.slice(0, options?.limit), count: found.length },
      }
    }),
    create: vi.fn(async (collection: string, data: Record<string, unknown>) => {
      const recordId = `created-${++nextId}`
      records[collection] ??= []
      records[collection].push({ recordId, data: { ...data } })
      return { success: true as const, data: { recordId } }
    }),
    update: vi.fn(async (
      collection: string,
      recordId: string,
      patch: Record<string, unknown>,
    ) => {
      const record = records[collection]?.find((candidate) => candidate.recordId === recordId)
      if (!record) return { success: false as const, error: 'Not found' }
      Object.assign(record.data, patch)
      return { success: true as const, data: { recordId } }
    }),
  }

  return {
    records,
    tools: tools as unknown as ActionTools,
  }
}

function context(
  tools: ActionTools,
  userId: string,
  params: Record<string, unknown>,
  env: Partial<Env> = {},
) {
  return {
    tools,
    userId,
    params,
    env: env as Env,
    callerJwt: 'test-token',
  }
}

describe('help server actions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not notify n8n when a help request is rejected', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const { tools } = makeTools({
      profiles: [{
        recordId: 'profile-1',
        data: { userId: 'maya', homeCommunityId: 'newton' },
      }],
      communities: [{
        recordId: 'newton',
        data: { name: 'Newton', municipality: 'Surrey', adjacentCommunityIds: [] },
      }],
    })

    const result = await createHelpItemAction(context(
      tools,
      'maya',
      {
        title: 'Need a phone charger',
        description: 'Maya can be reached at maya@example.com if this leaked.',
        category: 'power_charging',
        communityId: 'newton',
        kind: 'request',
      },
      {
        N8N_WEBHOOK_URL: 'https://example.test/webhook/neighbourgrid-help',
        N8N_WEBHOOK_TOKEN: 'test-token',
      },
    ))

    expect(result).toMatchObject({ success: false })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends an anonymous event only after a valid help request is stored', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const { tools } = makeTools({
      profiles: [{
        recordId: 'profile-1',
        data: { userId: 'maya', homeCommunityId: 'newton' },
      }],
      communities: [{
        recordId: 'newton',
        data: { name: 'Newton', municipality: 'Surrey', adjacentCommunityIds: [] },
      }],
    })
    const env = {
      N8N_WEBHOOK_URL: 'https://example.test/webhook/neighbourgrid-help',
      N8N_WEBHOOK_TOKEN: 'test-token',
    }

    const request = await createHelpItemAction(context(tools, 'maya', {
      title: 'Need a phone charger',
      description: 'Looking for a charger at the library tonight.',
      category: 'power_charging',
      communityId: 'newton',
      kind: 'request',
    }, env))
    const offer = await createHelpItemAction(context(tools, 'maya', {
      title: 'Offering a spare charger',
      description: 'I can lend a charger at the library tonight.',
      category: 'power_charging',
      communityId: 'newton',
      kind: 'offer',
    }, env))

    expect(request).toMatchObject({ success: true })
    expect(offer).toMatchObject({ success: true })
    expect(fetchMock).toHaveBeenCalledOnce()
    const body = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body))
    expect(body).toMatchObject({
      eventId: 'created-1',
      eventType: 'help_request_created',
      category: 'power_charging',
      communityName: 'Newton',
      municipality: 'Surrey',
    })
    expect(body).not.toHaveProperty('description')
    expect(body).not.toHaveProperty('title')
    expect(body).not.toHaveProperty('authorId')
  })

  it('creates one response and advances the request to offered', async () => {
    const { records, tools } = makeTools({
      help_items: [{
        recordId: 'help-1',
        data: {
          authorId: 'aisha',
          communityId: 'newton',
          kind: 'request',
          status: 'open',
        },
      }],
      memberships: [{
        recordId: 'member-1',
        data: { userId: 'maya', communityId: 'newton', status: 'approved' },
      }],
    })

    const result = await respondToHelpItemAction(context(tools, 'maya', {
      helpItemId: 'help-1',
      note: 'I can bring a charger to the library.',
    }))

    expect(result).toMatchObject({ success: true })
    expect(records.help_responses).toHaveLength(1)
    expect(records.help_responses[0].data.responderId).toBe('maya')
    expect(records.help_items[0].data.status).toBe('offered')
  })

  it('allows only the requester to accept an offer', async () => {
    const seed = {
      help_items: [{
        recordId: 'help-1',
        data: { authorId: 'aisha', status: 'offered' },
      }],
      help_responses: [{
        recordId: 'response-1',
        data: {
          helpItemId: 'help-1',
          responderId: 'maya',
          acceptedByRequester: false,
        },
      }],
    }
    const { records, tools } = makeTools(seed)

    const denied = await acceptHelpResponseAction(context(tools, 'maya', {
      responseId: 'response-1',
    }))
    expect(denied).toMatchObject({ success: false })

    const accepted = await acceptHelpResponseAction(context(tools, 'aisha', {
      responseId: 'response-1',
    }))
    expect(accepted).toMatchObject({ success: true })
    expect(records.help_responses[0].data.acceptedByRequester).toBe(true)
    expect(records.help_items[0].data.status).toBe('matched')
  })

  it('enforces the server-side beacon cooldown', async () => {
    const { tools } = makeTools({
      profiles: [{
        recordId: 'profile-1',
        data: { userId: 'maya', homeCommunityId: 'newton' },
      }],
      communities: [{
        recordId: 'newton',
        data: { adjacentCommunityIds: ['fleetwood'] },
      }],
      help_items: [{
        recordId: 'beacon-1',
        data: {
          authorId: 'maya',
          kind: 'beacon',
          createdAt: new Date().toISOString(),
        },
      }],
    })

    const result = await createHelpBeaconAction(context(tools, 'maya', {
      title: 'Charging help needed',
      description: 'Looking to charge a phone for an hour.',
      category: 'power_charging',
      communityId: 'newton',
      targetCommunityIds: ['fleetwood'],
    }))

    expect(result).toMatchObject({
      success: false,
      error: expect.stringContaining('cooldown'),
    })
  })

  it('sends a city-wide beacon across that city only', async () => {
    const { tools, records } = makeTools({
      profiles: [{
        recordId: 'profile-1',
        data: { userId: 'maya', homeCommunityId: 'newton' },
      }],
      communities: [
        { recordId: 'newton', data: { municipality: 'Surrey', adjacentCommunityIds: ['fleetwood'] } },
        { recordId: 'fleetwood', data: { municipality: 'Surrey', adjacentCommunityIds: [] } },
        { recordId: 'guildford', data: { municipality: 'Surrey', adjacentCommunityIds: [] } },
        { recordId: 'kitsilano', data: { municipality: 'Vancouver', adjacentCommunityIds: [] } },
      ],
    })

    const result = await createHelpBeaconAction(context(tools, 'maya', {
      title: 'Charging help needed',
      description: 'Looking to charge a phone for an hour.',
      category: 'power_charging',
      communityId: 'newton',
      targetCommunityIds: [],
      reach: 'city',
    }))

    expect(result).toMatchObject({ success: true })
    expect(records.help_items[0].data.targetCommunityIds).toEqual([
      'newton',
      'fleetwood',
      'guildford',
    ])
  })
})
