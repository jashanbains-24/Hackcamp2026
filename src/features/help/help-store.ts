import { useSyncExternalStore } from 'react'
import type { HelpCategory, HelpItem, HelpKind, HelpResponse, HelpStatus } from '@/shared/types'

const STORAGE_KEY = 'neighbourgrid.help-demo.v1'
const ACTOR_SESSION_KEY = 'neighbourgrid.help-demo.actor'
const CHANNEL_NAME = 'neighbourgrid-help-demo'
const BEACON_COOLDOWN_MS = 5 * 60 * 1000

export interface DemoActor {
  id: string
  displayName: string
}

export interface HelpDemoState {
  items: HelpItem[]
  responses: HelpResponse[]
  activeUserId: string
  lastBeaconAtByUser: Record<string, string>
}

export interface CreateHelpInput {
  kind: Exclude<HelpKind, 'beacon'>
  title: string
  description: string
  category: HelpCategory
  communityId: string
}

export interface CreateBeaconInput {
  title: string
  description: string
  category: HelpCategory
  communityId: string
  targetCommunityIds: string[]
}

export const demoActors: DemoActor[] = [
  { id: 'demo-user-maya', displayName: 'Maya' },
  { id: 'demo-user-aisha', displayName: 'Aisha K.' },
  { id: 'demo-user-daniel', displayName: 'Daniel R.' },
]

const seededState: HelpDemoState = {
  activeUserId: 'demo-user-maya',
  lastBeaconAtByUser: {},
  items: [
    {
      id: 'help-portable-charger',
      communityId: 'community-newton',
      authorId: 'demo-user-aisha',
      kind: 'request',
      title: 'Portable charger for tonight',
      description:
        'Looking to borrow a portable charger for a few hours. A public handoff near Newton Library would work.',
      category: 'power_charging',
      status: 'open',
      demo: true,
      targetCommunityIds: ['community-newton'],
      createdAt: '2026-11-07T22:36:00.000Z',
      updatedAt: '2026-11-07T22:36:00.000Z',
    },
    {
      id: 'help-battery-lanterns',
      communityId: 'community-newton',
      authorId: 'demo-user-daniel',
      kind: 'offer',
      title: 'Two battery lanterns to lend',
      description:
        'I can lend two small battery lanterns this evening and arrange a handoff in a public place.',
      category: 'supplies',
      status: 'open',
      demo: true,
      targetCommunityIds: ['community-newton'],
      createdAt: '2026-11-07T22:10:00.000Z',
      updatedAt: '2026-11-07T22:10:00.000Z',
    },
  ],
  responses: [],
}

let currentState: HelpDemoState | null = null
let browserListenersReady = false
let channel: BroadcastChannel | null = null
const listeners = new Set<() => void>()

function cloneSeededState(): HelpDemoState {
  return JSON.parse(JSON.stringify(seededState)) as HelpDemoState
}

function getSessionActor() {
  if (typeof window === 'undefined') return seededState.activeUserId
  const stored = window.sessionStorage.getItem(ACTOR_SESSION_KEY)
  return demoActors.some((actor) => actor.id === stored) ? stored! : seededState.activeUserId
}

function loadState(): HelpDemoState {
  if (typeof window === 'undefined') return cloneSeededState()
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return cloneSeededState()

  try {
    const parsed = JSON.parse(raw) as Partial<HelpDemoState>
    if (!Array.isArray(parsed.items) || !Array.isArray(parsed.responses)) {
      return cloneSeededState()
    }
    return {
      items: parsed.items,
      responses: parsed.responses,
      activeUserId: getSessionActor(),
      lastBeaconAtByUser: parsed.lastBeaconAtByUser ?? {},
    }
  } catch {
    return cloneSeededState()
  }
}

function getState(): HelpDemoState {
  if (!currentState) currentState = loadState()
  return currentState
}

function notify() {
  listeners.forEach((listener) => listener())
}

function receive(next: HelpDemoState) {
  currentState = {
    ...next,
    // Participant identity is tab-scoped so two open sessions can represent
    // different fictional residents while sharing the same help records.
    activeUserId: currentState?.activeUserId ?? getSessionActor(),
  }
  notify()
}

function persist(next: HelpDemoState) {
  currentState = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    channel?.postMessage(next)
  }
  notify()
}

function ensureBrowserListeners() {
  if (browserListenersReady || typeof window === 'undefined') return
  browserListenersReady = true

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      receive(JSON.parse(event.newValue) as HelpDemoState)
    } catch {
      // Ignore malformed external storage writes and preserve the last valid state.
    }
  })

  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.addEventListener('message', (event: MessageEvent<HelpDemoState>) => {
      if (event.data?.items && event.data?.responses) receive(event.data)
    })
  }
}

function subscribe(listener: () => void) {
  ensureBrowserListeners()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function makeId(prefix: string) {
  const value =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}-${value}`
}

function nowIso() {
  return new Date().toISOString()
}

function updateItemStatus(itemId: string, status: HelpStatus) {
  const state = getState()
  const updatedAt = nowIso()
  persist({
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, status, updatedAt } : item,
    ),
  })
}

export const helpDemoActions = {
  setActiveUser(userId: string) {
    if (!demoActors.some((actor) => actor.id === userId)) return
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ACTOR_SESSION_KEY, userId)
    }
    persist({ ...getState(), activeUserId: userId })
  },

  createHelp(input: CreateHelpInput) {
    const state = getState()
    const timestamp = nowIso()
    const item: HelpItem = {
      id: makeId('help'),
      authorId: state.activeUserId,
      kind: input.kind,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      communityId: input.communityId,
      status: 'open',
      demo: true,
      targetCommunityIds: [input.communityId],
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    persist({ ...state, items: [item, ...state.items] })
    return item
  },

  createBeacon(input: CreateBeaconInput) {
    const state = getState()
    const lastBeaconAt = state.lastBeaconAtByUser[state.activeUserId]
    if (
      lastBeaconAt &&
      Date.now() - new Date(lastBeaconAt).getTime() < BEACON_COOLDOWN_MS
    ) {
      return null
    }
    const timestamp = nowIso()
    const item: HelpItem = {
      id: makeId('beacon'),
      authorId: state.activeUserId,
      kind: 'beacon',
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      communityId: input.communityId,
      status: 'open',
      demo: true,
      targetCommunityIds: Array.from(
        new Set([input.communityId, ...input.targetCommunityIds]),
      ).slice(0, 3),
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    persist({
      ...state,
      items: [item, ...state.items],
      lastBeaconAtByUser: {
        ...state.lastBeaconAtByUser,
        [state.activeUserId]: timestamp,
      },
    })
    return item
  },

  respond(helpItemId: string, note: string) {
    const state = getState()
    const item = state.items.find((candidate) => candidate.id === helpItemId)
    if (!item || item.authorId === state.activeUserId) return null
    if (!['open', 'offered'].includes(item.status)) return null

    const existing = state.responses.find(
      (response) =>
        response.helpItemId === helpItemId && response.responderId === state.activeUserId,
    )
    if (existing) return existing

    const response: HelpResponse = {
      id: makeId('response'),
      helpItemId,
      responderId: state.activeUserId,
      note: note.trim(),
      acceptedByRequester: false,
      createdAt: nowIso(),
    }
    persist({
      ...state,
      responses: [response, ...state.responses],
      items: state.items.map((candidate) =>
        candidate.id === helpItemId
          ? { ...candidate, status: 'offered', updatedAt: response.createdAt }
          : candidate,
      ),
    })
    return response
  },

  acceptResponse(responseId: string) {
    const state = getState()
    const response = state.responses.find((candidate) => candidate.id === responseId)
    if (!response) return false
    const item = state.items.find((candidate) => candidate.id === response.helpItemId)
    if (!item || item.authorId !== state.activeUserId || item.status !== 'offered') return false

    const updatedAt = nowIso()
    persist({
      ...state,
      responses: state.responses.map((candidate) =>
        candidate.helpItemId === item.id
          ? { ...candidate, acceptedByRequester: candidate.id === responseId }
          : candidate,
      ),
      items: state.items.map((candidate) =>
        candidate.id === item.id ? { ...candidate, status: 'matched', updatedAt } : candidate,
      ),
    })
    return true
  },

  resolve(itemId: string) {
    const state = getState()
    const item = state.items.find((candidate) => candidate.id === itemId)
    if (!item || item.authorId !== state.activeUserId || item.status !== 'matched') return false
    updateItemStatus(itemId, 'resolved')
    return true
  },

  cancel(itemId: string) {
    const state = getState()
    const item = state.items.find((candidate) => candidate.id === itemId)
    if (!item || item.authorId !== state.activeUserId) return false
    if (['resolved', 'cancelled'].includes(item.status)) return false
    updateItemStatus(itemId, 'cancelled')
    return true
  },

  reset() {
    persist(cloneSeededState())
  },
}

export function useHelpDemoStore() {
  return useSyncExternalStore(subscribe, getState, () => seededState)
}

export function getHelpDemoSnapshot() {
  return getState()
}

export function getActorName(userId: string) {
  return demoActors.find((actor) => actor.id === userId)?.displayName ?? 'Neighbour'
}

export function getBeaconCooldown(activeUserId: string, state = getState()) {
  const lastCreatedAt = state.lastBeaconAtByUser[activeUserId]
  if (!lastCreatedAt) return { available: true, remainingMs: 0 }
  const remainingMs = BEACON_COOLDOWN_MS - (Date.now() - new Date(lastCreatedAt).getTime())
  return {
    available: remainingMs <= 0,
    remainingMs: Math.max(0, remainingMs),
  }
}

export const helpCategoryLabels: Record<HelpCategory, string> = {
  power_charging: 'Power & charging',
  supplies: 'Supplies',
  mobility_accessibility: 'Mobility & accessibility',
  transportation: 'Transportation',
  wellness_checkin: 'Wellness check-in',
  other: 'Other',
}
