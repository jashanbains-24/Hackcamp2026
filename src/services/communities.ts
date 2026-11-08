import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Comment, Community, Membership, Post, PostKind } from '@/shared/types'
import { communities as communityCatalog, demoPosts, demoUser, postAuthors } from '@/shared/demo-data'
import { useNeighbourGridSession } from '@/neighbourgrid/exports'

export { communityCatalog }

export const currentUserId = demoUser.id

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
    body: 'Same flicker here. Power is still on, so we set a lantern by the door just in case.',
    createdAt: '2026-11-07T22:30:00.000Z',
  },
]

const storageKey = 'neighbourgrid.communities.v1'
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
    const posts = parsed.posts ?? demoPosts
    const comments = parsed.comments ?? initialComments
    const seedPost = demoPosts.find((post) => post.id === 'post-library-hours')
    const seedComment = initialComments.find((comment) => comment.id === 'comment-library-hours-1')
    return {
      memberships: parsed.memberships ?? initialMemberships,
      posts: seedPost
        ? posts.map((post) =>
            post.id === seedPost.id ? { ...post, title: seedPost.title, body: seedPost.body } : post,
          )
        : posts,
      comments: seedComment
        ? comments.map((comment) =>
            comment.id === seedComment.id ? { ...comment, body: seedComment.body } : comment,
          )
        : comments,
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
  input: Pick<Post, 'kind' | 'title' | 'body'> & { images?: string[] },
  now = new Date().toISOString(),
): Post {
  const images = input.images?.slice(0, 5)
  return {
    kind: input.kind,
    title: input.title,
    body: input.body,
    ...(images && images.length > 0 ? { images } : {}),
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
  const session = useNeighbourGridSession()
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

  const selectHome = useCallback(async () => {
    if (!communityId || !canPublish(communityId, state.memberships)) return false
    await session.setHomeCommunityId(communityId)
    return true
  }, [communityId, session, state.memberships])

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
    (input: Pick<Post, 'kind' | 'title' | 'body'> & { images?: string[] }) => {
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
