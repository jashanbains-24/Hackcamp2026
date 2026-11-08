import { useMemo } from 'react'
import { getAuthToken, useQuery } from 'deepspace'
import { useNeighbourGridSession } from '@/neighbourgrid/exports'
import type { HelpItem, HelpResponse } from '@/shared/types'
import {
  getActorName,
  getBeaconCooldown,
  helpDemoActions,
  useHelpDemoStore,
  type CreateBeaconInput,
  type CreateHelpInput,
} from './help-store'

const BEACON_COOLDOWN_MS = 5 * 60 * 1000

type HelpItemRow = Omit<HelpItem, 'id'>
type HelpResponseRow = Omit<HelpResponse, 'id'>

type ActionResponse = {
  success?: boolean
  data?: { recordId?: string }
  error?: string
}

async function callHelpAction(
  name: string,
  params: object,
): Promise<string | undefined> {
  const token = await getAuthToken()
  if (!token) throw new Error('Sign in before changing the live help board.')

  const response = await fetch(`/api/actions/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })
  const payload = (await response.json().catch(() => ({}))) as ActionResponse
  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || 'The help board could not save this change.')
  }
  return payload.data?.recordId
}

function mapHelpItems(records: Array<{ recordId: string; data: HelpItemRow }>): HelpItem[] {
  return records.map((record) => ({ id: record.recordId, ...record.data }))
}

function mapHelpResponses(
  records: Array<{ recordId: string; data: HelpResponseRow }>,
): HelpResponse[] {
  return records.map((record) => ({ id: record.recordId, ...record.data }))
}

export function useHelpNetwork() {
  const session = useNeighbourGridSession()
  const demoState = useHelpDemoStore()
  const live = session.mode === 'authenticated'

  const itemsQuery = useQuery<HelpItemRow>('help_items', {
    where: { communityId: session.homeCommunityId },
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 100,
  })
  const responsesQuery = useQuery<HelpResponseRow>('help_responses', {
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 200,
  })

  const items = useMemo(
    () => (live ? mapHelpItems(itemsQuery.records) : demoState.items),
    [demoState.items, itemsQuery.records, live],
  )
  const responses = useMemo(
    () => (live ? mapHelpResponses(responsesQuery.records) : demoState.responses),
    [demoState.responses, live, responsesQuery.records],
  )
  const activeUserId = live ? session.userId ?? '' : demoState.activeUserId

  const beaconCooldown = useMemo(() => {
    if (!live) return getBeaconCooldown(activeUserId, demoState)
    const latest = items
      .filter((item) => item.kind === 'beacon' && item.authorId === activeUserId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    if (!latest) return { available: true, remainingMs: 0 }
    const remainingMs =
      BEACON_COOLDOWN_MS - (Date.now() - new Date(latest.createdAt).getTime())
    return {
      available: remainingMs <= 0,
      remainingMs: Math.max(0, remainingMs),
    }
  }, [activeUserId, demoState, items, live])

  const status =
    !live
      ? 'demo'
      : itemsQuery.status === 'error' || responsesQuery.status === 'error'
        ? 'error'
        : itemsQuery.status === 'loading' || responsesQuery.status === 'loading'
          ? 'loading'
          : 'ready'

  return {
    source: live ? ('live' as const) : ('demo' as const),
    status,
    error: itemsQuery.error ?? responsesQuery.error,
    items,
    responses,
    activeUserId,
    session,
    beaconCooldown,
    actorName(userId: string) {
      if (!live) return getActorName(userId)
      return userId === session.userId ? session.displayName : 'Neighbour'
    },
    setActiveUser(userId: string) {
      if (!live) helpDemoActions.setActiveUser(userId)
    },
    resetDemo() {
      if (!live) helpDemoActions.reset()
    },
    async createHelp(input: CreateHelpInput) {
      if (!live) return helpDemoActions.createHelp(input).id
      return callHelpAction('createHelpItem', input)
    },
    async createBeacon(input: CreateBeaconInput) {
      if (!live) return helpDemoActions.createBeacon(input)?.id
      const reach = input.reach ?? 'nearby'
      return callHelpAction('createHelpBeacon', {
        ...input,
        reach,
        targetCommunityIds: reach === 'nearby' ? input.targetCommunityIds.slice(0, 2) : [],
      })
    },
    async respond(helpItemId: string, note: string) {
      if (!live) return helpDemoActions.respond(helpItemId, note)?.id
      return callHelpAction('respondToHelpItem', { helpItemId, note })
    },
    async acceptResponse(responseId: string) {
      if (!live) return helpDemoActions.acceptResponse(responseId)
      await callHelpAction('acceptHelpResponse', { responseId })
      return true
    },
    async resolve(itemId: string) {
      if (!live) return helpDemoActions.resolve(itemId)
      await callHelpAction('resolveHelpItem', { itemId })
      return true
    },
    async cancel(itemId: string) {
      if (!live) return helpDemoActions.cancel(itemId)
      await callHelpAction('cancelHelpItem', { itemId })
      return true
    },
  }
}
