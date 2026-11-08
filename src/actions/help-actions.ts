import { z } from 'zod'
import type { ActionHandler, ActionResult } from 'deepspace/worker'
import type { Env } from '../../worker'
import { buildHelpRequestEvent, notifyHelpRequestCreated } from '../server/n8n-events'
import type { HelpItem, HelpResponse } from '../shared/types'

const BEACON_COOLDOWN_MS = 5 * 60 * 1000
const contactPattern =
  /(?:\+?\d[\d\s().-]{7,}\d)|(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i

const categorySchema = z.enum([
  'power_charging',
  'supplies',
  'mobility_accessibility',
  'transportation',
  'wellness_checkin',
  'other',
])

const baseHelpSchema = z.object({
  title: z.string().trim().min(5).max(80),
  description: z.string().trim().min(12).max(500),
  category: categorySchema,
  communityId: z.string().trim().min(1).max(120),
})

const createHelpSchema = baseHelpSchema.extend({
  kind: z.enum(['request', 'offer']),
})

const createBeaconSchema = baseHelpSchema.extend({
  targetCommunityIds: z.array(z.string().trim().min(1).max(120)).max(2),
  reach: z.enum(['nearby', 'city', 'region']).default('nearby'),
})

const respondSchema = z.object({
  helpItemId: z.string().trim().min(1).max(200),
  note: z.string().trim().min(3).max(240),
})

const recordIdSchema = z.object({
  itemId: z.string().trim().min(1).max(200),
})

const acceptSchema = z.object({
  responseId: z.string().trim().min(1).max(200),
})

type RecordEnvelope<T> = {
  recordId: string
  data: T
}

type ProfileRow = {
  userId: string
  homeCommunityId: string | null
}

type MembershipRow = {
  userId: string
  communityId: string
  status: 'pending' | 'approved' | 'rejected'
}

type CommunityRow = {
  name?: string
  municipality?: string
  adjacentCommunityIds: string[]
}

type HelpItemRow = Omit<HelpItem, 'id'>
type HelpResponseRow = Omit<HelpResponse, 'id'>

function asEnvelope<T>(value: unknown): RecordEnvelope<T> {
  return value as RecordEnvelope<T>
}

function fail(error: string): ActionResult<never> {
  return { success: false, error }
}

function hasPublicContactDetails(value: string): boolean {
  return contactPattern.test(value)
}

async function getProfile(
  tools: Parameters<ActionHandler<Env>>[0]['tools'],
  userId: string,
): Promise<RecordEnvelope<ProfileRow> | null> {
  const result = await tools.query('profiles', { where: { userId }, limit: 1 })
  if (!result.success) return null
  const record = result.data.records[0]
  return record ? asEnvelope<ProfileRow>(record) : null
}

async function canPostToCommunity(
  tools: Parameters<ActionHandler<Env>>[0]['tools'],
  userId: string,
  communityId: string,
): Promise<boolean> {
  const profile = await getProfile(tools, userId)
  if (profile?.data.homeCommunityId === communityId) return true

  const memberships = await tools.query('memberships', {
    where: { userId, communityId },
    limit: 1,
  })
  if (!memberships.success) return false
  const membershipRecord = memberships.data.records[0]
  const membership = membershipRecord
    ? asEnvelope<MembershipRow>(membershipRecord)
    : undefined
  return membership?.data.status === 'approved'
}

export const createHelpItemAction: ActionHandler<Env> = async ({
  params,
  tools,
  userId,
  env,
}) => {
  const parsed = createHelpSchema.safeParse(params)
  if (!parsed.success) return fail('Enter a valid title, description, category, and community.')
  if (hasPublicContactDetails(`${parsed.data.title} ${parsed.data.description}`)) {
    return fail('Remove phone numbers and email addresses before posting.')
  }
  if (!(await canPostToCommunity(tools, userId, parsed.data.communityId))) {
    return fail('Join this community before posting help there.')
  }

  const timestamp = new Date().toISOString()
  const created = await tools.create('help_items', {
    ...parsed.data,
    authorId: userId,
    status: 'open',
    demo: false,
    targetCommunityIds: [parsed.data.communityId],
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies HelpItemRow)
  if (created.success && parsed.data.kind === 'request') {
    const communityResult = await tools.get('communities', parsed.data.communityId)
    const community = communityResult.success
      ? asEnvelope<CommunityRow>(communityResult.data.record)
      : null
    await notifyHelpRequestCreated(env, buildHelpRequestEvent({
      eventId: created.data.recordId,
      category: parsed.data.category,
      communityName: community?.data.name,
      municipality: community?.data.municipality,
      createdAt: timestamp,
    }))
  }
  return created
}

export const createHelpBeaconAction: ActionHandler<Env> = async ({
  params,
  tools,
  userId,
}) => {
  const parsed = createBeaconSchema.safeParse(params)
  if (!parsed.success) return fail('Enter a valid beacon description and community selection.')
  if (hasPublicContactDetails(`${parsed.data.title} ${parsed.data.description}`)) {
    return fail('Remove phone numbers and email addresses before sending a beacon.')
  }

  const profile = await getProfile(tools, userId)
  if (!profile?.data.homeCommunityId) return fail('Choose a home community before sending a beacon.')
  if (profile.data.homeCommunityId !== parsed.data.communityId) {
    return fail('A beacon must start in your home community.')
  }

  const communityResult = await tools.get('communities', parsed.data.communityId)
  const community = communityResult.success
    ? asEnvelope<CommunityRow>(communityResult.data.record)
    : null
  const reach = parsed.data.reach
  let extraTargets: string[]
  if (reach === 'nearby') {
    const allowedTargets = new Set([
      parsed.data.communityId,
      ...(community?.data.adjacentCommunityIds ?? []),
    ])
    if (parsed.data.targetCommunityIds.some((targetId) => !allowedTargets.has(targetId))) {
      return fail('One or more selected communities cannot receive this beacon.')
    }
    extraTargets = parsed.data.targetCommunityIds
  } else {
    const listed = await tools.query('communities', { limit: 80 })
    if (!listed.success) return listed
    if (reach === 'city' && !community?.data.municipality) {
      return fail('This community has no city, so a city-wide beacon cannot be sent.')
    }
    extraTargets = listed.data.records
      .map((record) => asEnvelope<CommunityRow>(record))
      .filter((row) => row.recordId !== parsed.data.communityId)
      .filter((row) =>
        reach === 'region' || row.data.municipality === community?.data.municipality,
      )
      .map((row) => row.recordId)
  }

  const recent = await tools.query('help_items', {
    where: { authorId: userId, kind: 'beacon' },
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 1,
  })
  if (!recent.success) return recent
  const latestRecord = recent.data.records[0]
  const latest = latestRecord ? asEnvelope<HelpItemRow>(latestRecord) : undefined
  if (
    latest &&
    Date.now() - Date.parse(latest.data.createdAt) < BEACON_COOLDOWN_MS
  ) {
    return fail('Beacon cooldown active. Wait five minutes before sending another.')
  }

  const timestamp = new Date().toISOString()
  const targetCommunityIds = Array.from(
    new Set([parsed.data.communityId, ...extraTargets]),
  )
  return tools.create('help_items', {
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    communityId: parsed.data.communityId,
    authorId: userId,
    kind: 'beacon',
    status: 'open',
    demo: false,
    targetCommunityIds,
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies HelpItemRow)
}

export const respondToHelpItemAction: ActionHandler<Env> = async ({
  params,
  tools,
  userId,
}) => {
  const parsed = respondSchema.safeParse(params)
  if (!parsed.success) return fail('Add a short note describing how you can help.')
  if (hasPublicContactDetails(parsed.data.note)) {
    return fail('Keep phone numbers and email addresses out of the public response note.')
  }

  const itemResult = await tools.get('help_items', parsed.data.helpItemId)
  if (!itemResult.success) return fail('This help item is no longer available.')
  const item = asEnvelope<HelpItemRow>(itemResult.data.record)
  if (item.data.authorId === userId) return fail('You cannot respond to your own help item.')
  if (!['request', 'beacon'].includes(item.data.kind)) {
    return fail('Offers do not accept help responses.')
  }
  if (!['open', 'offered'].includes(item.data.status)) {
    return fail('This help item is no longer accepting responses.')
  }
  if (!(await canPostToCommunity(tools, userId, item.data.communityId))) {
    return fail('Join this community before responding.')
  }

  const existingResult = await tools.query('help_responses', {
    where: { helpItemId: parsed.data.helpItemId, responderId: userId },
    limit: 1,
  })
  if (!existingResult.success) return existingResult
  if (existingResult.data.records.length > 0) {
    return fail('You already offered help on this item.')
  }

  const timestamp = new Date().toISOString()
  const created = await tools.create('help_responses', {
    helpItemId: parsed.data.helpItemId,
    responderId: userId,
    note: parsed.data.note,
    acceptedByRequester: false,
    createdAt: timestamp,
  } satisfies HelpResponseRow)
  if (!created.success) return created

  if (item.data.status === 'open') {
    const updated = await tools.update('help_items', item.recordId, {
      status: 'offered',
      updatedAt: timestamp,
    })
    if (!updated.success) return updated
  }
  return created
}

export const acceptHelpResponseAction: ActionHandler<Env> = async ({
  params,
  tools,
  userId,
}) => {
  const parsed = acceptSchema.safeParse(params)
  if (!parsed.success) return fail('Choose a valid help response.')

  const responseResult = await tools.get('help_responses', parsed.data.responseId)
  if (!responseResult.success) return fail('This response is no longer available.')
  const response = asEnvelope<HelpResponseRow>(responseResult.data.record)
  const itemResult = await tools.get('help_items', response.data.helpItemId)
  if (!itemResult.success) return fail('This help item is no longer available.')
  const item = asEnvelope<HelpItemRow>(itemResult.data.record)
  if (item.data.authorId !== userId) return fail('Only the requester can accept an offer.')
  if (item.data.status !== 'offered') return fail('This help item is not ready to be matched.')

  const responsesResult = await tools.query('help_responses', {
    where: { helpItemId: item.recordId },
    limit: 100,
  })
  if (!responsesResult.success) return responsesResult

  for (const rawCandidate of responsesResult.data.records) {
    const candidate = asEnvelope<HelpResponseRow>(rawCandidate)
    const updated = await tools.update('help_responses', candidate.recordId, {
      acceptedByRequester: candidate.recordId === response.recordId,
    })
    if (!updated.success) return updated
  }

  return tools.update('help_items', item.recordId, {
    status: 'matched',
    updatedAt: new Date().toISOString(),
  })
}

function makeOwnerStatusAction(
  status: 'resolved' | 'cancelled',
): ActionHandler<Env> {
  return async ({ params, tools, userId }) => {
    const parsed = recordIdSchema.safeParse(params)
    if (!parsed.success) return fail('Choose a valid help item.')

    const itemResult = await tools.get('help_items', parsed.data.itemId)
    if (!itemResult.success) return fail('This help item is no longer available.')
    const item = asEnvelope<HelpItemRow>(itemResult.data.record)
    if (item.data.authorId !== userId) {
      return fail('Only the owner can change this help item.')
    }
    if (status === 'resolved' && item.data.status !== 'matched') {
      return fail('Match this request before marking it resolved.')
    }
    if (status === 'cancelled' && ['resolved', 'cancelled'].includes(item.data.status)) {
      return fail('This help item is already closed.')
    }

    return tools.update('help_items', item.recordId, {
      status,
      updatedAt: new Date().toISOString(),
    })
  }
}

export const resolveHelpItemAction = makeOwnerStatusAction('resolved')
export const cancelHelpItemAction = makeOwnerStatusAction('cancelled')
