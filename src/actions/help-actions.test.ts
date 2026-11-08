import { describe, expect, it, vi } from 'vitest'
import type { ActionTools } from 'deepspace/worker'
import type { Env } from '../../worker'
import {
  acceptHelpResponseAction,
  createHelpBeaconAction,
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
) {
  return {
    tools,
    userId,
    params,
    env: {} as Env,
    callerJwt: 'test-token',
  }
}

describe('help server actions', () => {
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
})
