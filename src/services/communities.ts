import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Comment, Community, Membership, Post, PostKind } from '@/shared/types'
import { communities as seededCommunities, demoPosts, demoUser, postAuthors } from '@/shared/demo-data'

export const currentUserId = demoUser.id

const extraCommunities: Community[] = [
  {
    id: 'community-cloverdale',
    slug: 'cloverdale',
    name: 'Cloverdale',
    municipality: 'Surrey',
    description: 'Neighbour conversations, local resources, and practical support.',
    visibility: 'public',
    adjacentCommunityIds: ['community-newton', 'community-city-centre'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
  {
    id: 'community-city-centre',
    slug: 'city-centre',
    name: 'City Centre',
    municipality: 'Surrey',
    description: 'A shared space for people living and spending time in central Surrey.',
    visibility: 'public',
    adjacentCommunityIds: ['community-newton', 'community-cloverdale'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
  {
    id: 'community-ladner',
    slug: 'ladner',
    name: 'Ladner',
    municipality: 'Delta',
    description: 'A calm place for local updates and neighbour-to-neighbour offers.',
    visibility: 'request_to_join',
    adjacentCommunityIds: ['community-north-delta'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
  {
    id: 'community-north-delta',
    slug: 'north-delta',
    name: 'North Delta',
    municipality: 'Delta',
    description: 'Connect with neighbours around everyday community needs.',
    visibility: 'public',
    adjacentCommunityIds: ['community-ladner', 'community-newton'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
  {
    id: 'community-burnaby-metrotown',
    slug: 'burnaby-metrotown',
    name: 'Burnaby Metrotown',
    municipality: 'Burnaby',
    description: 'Local conversations and resource sharing around Metrotown.',
    visibility: 'request_to_join',
    adjacentCommunityIds: [],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
]

export const communityCatalog = [...seededCommunities, ...extraCommunities]

const initialMemberships: Membership[] = [
  {
    id: 'membership-newton-demo-user',
    userId: currentUserId,
    communityId: 'community-newton',
    status: 'approved',
    createdAt: '2026-11-07T20:00:00.000Z',
  },
]

const initialComments: Comment[] = [
  {
    id: 'comment-library-hours-1',
    postId: 'post-library-hours',
    authorId: 'demo-user-maya',
    body: 'The Newton library branch has quiet tables during weekday afternoons.',
    createdAt: '2026-11-07T22:30:00.000Z',
  },
]

const storageKey = 'neighbourgrid.communities.v1'
const homeCommunityKey = 'neighbourgrid.home-community'
type CommunityState = { memberships: Membership[]; posts: Post[]; comments: Comment[] }

const seedState: CommunityState = {
  memberships: initialMemberships,
  posts: demoPosts,
  comments: initialComments,
}

function readState(): CommunityState {
  if (typeof window === 'undefined') return seedState
  const saved = window.localStorage.getItem(storageKey)
  if (!saved) return seedState
  try {
    const parsed = JSON.parse(saved) as Partial<CommunityState>
    return {
      memberships: parsed.memberships ?? initialMemberships,
      posts: parsed.posts ?? demoPosts,
      comments: parsed.comments ?? initialComments,
    }
  } catch {
    return seedState
  }
}

function persistState(state: CommunityState) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

export function getCommunityBySlug(slug: string | undefined) {
  return communityCatalog.find((community) => community.slug === slug)
}

export function getCommunityById(id: string | undefined) {
  return communityCatalog.find((community) => community.id === id)
}

export function useHomeCommunity() {
  const [homeCommunityId, setHomeCommunityId] = useState(
    () => (typeof window === 'undefined' ? demoUser.homeCommunityId : window.localStorage.getItem(homeCommunityKey)) ??
      demoUser.homeCommunityId,
  )

  useEffect(() => {
    const onHomeChange = (event: Event) => {
      const next = (event as CustomEvent<string>).detail
      if (next) setHomeCommunityId(next)
    }
    window.addEventListener('neighbourgrid:home-community', onHomeChange)
    return () => window.removeEventListener('neighbourgrid:home-community', onHomeChange)
  }, [])

  return { homeCommunityId }
}

export function getAuthorName(authorId: string) {
  return postAuthors[authorId] ?? (authorId === currentUserId ? demoUser.displayName : 'Neighbour')
}

export function getMembership(communityId: string, memberships: Membership[]) {
  return memberships.find(
    (membership) => membership.communityId === communityId && membership.userId === currentUserId,
  )
}

export function canPublish(communityId: string, memberships: Membership[]) {
  return getMembership(communityId, memberships)?.status === 'approved'
}

export function postsForCommunity(posts: Post[], communityId: string) {
  return posts
    .filter((post) => post.communityId === communityId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function createPostRecord(
  communityId: string,
  input: Pick<Post, 'kind' | 'title' | 'body'>,
  now = new Date().toISOString(),
): Post {
  return {
    ...input,
    id: nextId('post'),
    communityId,
    authorId: currentUserId,
    createdAt: now,
    updatedAt: now,
  }
}

export function createCommentRecord(postId: string, body: string, now = new Date().toISOString()): Comment {
  return {
    id: nextId('comment'),
    postId,
    authorId: currentUserId,
    body,
    createdAt: now,
  }
}

export function useCommunityState() {
  const [state, setState] = useState<CommunityState>(readState)

  const update = useCallback((next: CommunityState) => {
    setState(next)
    persistState(next)
    window.dispatchEvent(new Event('neighbourgrid:community-state'))
  }, [])

  useEffect(() => {
    const onStorage = () => setState(readState())
    window.addEventListener('storage', onStorage)
    window.addEventListener('neighbourgrid:community-state', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('neighbourgrid:community-state', onStorage)
    }
  }, [])

  return { state, update }
}

export function useMembership(communityId: string | undefined) {
  const { state, update } = useCommunityState()
  const membership = communityId ? getMembership(communityId, state.memberships) : undefined

  const join = useCallback(() => {
    if (!communityId || membership?.status === 'approved') return
    const nextMembership: Membership = {
      id: nextId('membership'),
      userId: currentUserId,
      communityId,
      status: getCommunityById(communityId)?.visibility === 'request_to_join' ? 'pending' : 'approved',
      createdAt: new Date().toISOString(),
    }
    update({
      ...state,
      memberships: [...state.memberships.filter((item) => item.communityId !== communityId), nextMembership],
    })
  }, [communityId, membership?.status, state, update])

  const selectHome = useCallback(() => {
    if (!communityId || !canPublish(communityId, state.memberships)) return false
    update({
      ...state,
      memberships: state.memberships,
    })
    window.localStorage.setItem(homeCommunityKey, communityId)
    window.dispatchEvent(new CustomEvent('neighbourgrid:home-community', { detail: communityId }))
    return true
  }, [communityId, state, update])

  return { membership, join, selectHome, isApproved: membership?.status === 'approved' }
}

export function useCommunityFeed(communityId: string | undefined) {
  const { state, update } = useCommunityState()
  const posts = useMemo(() => postsForCommunity(state.posts, communityId ?? ''), [communityId, state.posts])
  const commentsFor = useCallback(
    (postId: string) => state.comments.filter((comment) => comment.postId === postId),
    [state.comments],
  )

  const createPost = useCallback(
    (input: Pick<Post, 'kind' | 'title' | 'body'>) => {
      if (!communityId || !canPublish(communityId, state.memberships)) {
        throw new Error('Approved membership is required to publish in this community.')
      }
      const post = createPostRecord(communityId, input)
      update({ ...state, posts: [post, ...state.posts] })
      return post
    },
    [communityId, state, update],
  )

  const addComment = useCallback(
    (postId: string, body: string) => {
      if (!communityId || !canPublish(communityId, state.memberships)) {
        throw new Error('Approved membership is required to comment in this community.')
      }
      const comment = createCommentRecord(postId, body)
      update({ ...state, comments: [...state.comments, comment] })
      return comment
    },
    [communityId, state, update],
  )

  const deletePost = useCallback(
    (postId: string) => {
      const post = state.posts.find((item) => item.id === postId)
      if (!post || post.authorId !== currentUserId) throw new Error('Only the author can delete this post.')
      update({
        ...state,
        posts: state.posts.filter((item) => item.id !== postId),
        comments: state.comments.filter((comment) => comment.postId !== postId),
      })
    },
    [state, update],
  )

  return { posts, commentsFor, createPost, addComment, deletePost }
}

export function usePost(postId: string | undefined) {
  const { state, update } = useCommunityState()
  const post = state.posts.find((item) => item.id === postId)
  const comments = state.comments.filter((comment) => comment.postId === postId)

  const editPost = useCallback(
    (title: string, body: string) => {
      if (!post || post.authorId !== currentUserId) throw new Error('Only the author can edit this post.')
      update({
        ...state,
        posts: state.posts.map((item) =>
          item.id === post.id ? { ...item, title, body, updatedAt: new Date().toISOString() } : item,
        ),
      })
    },
    [post, state, update],
  )

  const deletePost = useCallback(() => {
    if (!post || post.authorId !== currentUserId) throw new Error('Only the author can delete this post.')
    update({
      ...state,
      posts: state.posts.filter((item) => item.id !== post.id),
      comments: state.comments.filter((comment) => comment.postId !== post.id),
    })
  }, [post, state, update])

  return { post, comments, editPost, deletePost }
}

export function postKindLabel(kind: PostKind) {
  return kind === 'local_update'
    ? 'Local update'
    : kind === 'resource_offer'
      ? 'Resource offer'
      : 'Discussion'
}
