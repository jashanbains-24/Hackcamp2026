export type CommunityVisibility = 'public' | 'request_to_join'
export type MemberStatus = 'pending' | 'approved' | 'rejected'
export type PostKind = 'discussion' | 'local_update' | 'resource_offer'
export type HelpKind = 'request' | 'offer' | 'beacon'
export type HelpStatus = 'open' | 'offered' | 'matched' | 'resolved' | 'cancelled'
export type HelpCategory =
  | 'power_charging'
  | 'supplies'
  | 'mobility_accessibility'
  | 'transportation'
  | 'wellness_checkin'
  | 'other'

export interface Community {
  id: string
  slug: string
  name: string
  municipality: string
  description: string
  visibility: CommunityVisibility
  adjacentCommunityIds: string[]
  createdAt: string
}

export interface UserProfile {
  id: string
  displayName: string
  homeCommunityId: string | null
  createdAt: string
}

export interface Membership {
  id: string
  userId: string
  communityId: string
  status: MemberStatus
  createdAt: string
}

export interface Post {
  id: string
  communityId: string
  authorId: string
  kind: PostKind
  title: string
  body: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: string
}

export interface HelpItem {
  id: string
  communityId: string
  authorId: string
  kind: HelpKind
  title: string
  description: string
  category: HelpCategory
  status: HelpStatus
  demo: boolean
  targetCommunityIds: string[]
  createdAt: string
  updatedAt: string
}

export interface HelpResponse {
  id: string
  helpItemId: string
  responderId: string
  note: string
  acceptedByRequester: boolean
  createdAt: string
}

export interface OfficialUpdate {
  id: string
  sourceName: string
  sourceUrl: string
  title: string
  description: string
  municipality: string | null
  status: 'current' | 'restored' | 'advisory' | 'unknown'
  publishedAt: string | null
  fetchedAt: string
  isDemo: boolean
}
