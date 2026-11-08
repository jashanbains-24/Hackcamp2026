/**
 * Stable imports for Developers B and C.
 *
 * ```ts
 * import {
 *   useNeighbourGridSession,
 *   useHomeAggregates,
 *   useOfficialUpdates,
 *   neighbourgridCollectionNames,
 * } from '@/neighbourgrid/exports'
 * ```
 *
 * Shared domain types stay in `@/shared/types` — do not rename them.
 * Collection schemas live in `@/schemas/neighbourgrid-schema` and are owned by A.
 * Propose schema/permission changes to A before depending on them.
 */

export {
  useNeighbourGridSession,
  NeighbourGridSessionProvider,
} from './session'
export type { NeighbourGridSession, SessionMode } from './session'
export { useHomeAggregates } from './home-data'
export type {
  HomeAggregates,
  HomeActivityItem,
  HomeHelpPreview,
  HomePostPreview,
} from './home-data'
export { useOfficialUpdates } from './official-updates'
export type { OfficialUpdatesState } from './official-updates'
export {
  persistDemoMode,
  persistHomeCommunityId,
  isDemoModePersisted,
  readStoredHomeCommunityId,
} from './demo-mode'

export const neighbourgridCollectionNames = {
  profiles: 'profiles',
  communities: 'communities',
  memberships: 'memberships',
  posts: 'posts',
  comments: 'comments',
  helpItems: 'help_items',
  helpResponses: 'help_responses',
  officialUpdates: 'official_updates',
} as const

/**
 * Contract notes for B/C:
 *
 * - Identity fields `userId` / `authorId` / `responderId` are `userBound` and
 *   immutable. Never trust a browser-supplied identity for authorization.
 * - Membership approval for `request_to_join` communities should move behind a
 *   server action before production hardening; current member writes can set
 *   their own membership row (A's baseline for parallel work).
 * - Help response acceptance / resolve-cancel ownership is Person C's lane;
 *   schema allows author/responder own updates, app logic must still check.
 * - Official live feed: GET `/api/official-updates` (Surrey municipality RSS).
 *   Do not invent Newton-specific claims from Surrey items.
 */
