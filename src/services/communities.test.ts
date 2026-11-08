import { describe, expect, it } from 'vitest'
import type { Membership, Post } from '@/shared/types'
import {
  canPublish,
  communityCatalog,
  createCommentRecord,
  createPostRecord,
  currentUserId,
  getCommunityBySlug,
  postsForCommunity,
} from './communities'

const approvedNewton: Membership = {
  id: 'membership-test',
  userId: currentUserId,
  communityId: 'community-newton',
  status: 'approved',
  createdAt: '2026-11-07T20:00:00.000Z',
}

describe('community adapter', () => {
  it('keeps membership write access limited to approved members', () => {
    expect(canPublish('community-newton', [approvedNewton])).toBe(true)
    expect(canPublish('community-guildford', [{ ...approvedNewton, communityId: 'community-guildford', status: 'pending' }])).toBe(false)
  })

  it('returns only posts from the requested community', () => {
    const posts: Post[] = [
      createPostRecord('community-newton', { kind: 'discussion', title: 'Newton', body: 'A' }, '2026-11-07T22:00:00.000Z'),
      createPostRecord('community-fleetwood', { kind: 'discussion', title: 'Fleetwood', body: 'B' }, '2026-11-07T23:00:00.000Z'),
    ]
    expect(postsForCommunity(posts, 'community-newton').map((post) => post.title)).toEqual(['Newton'])
  })

  it('creates posts and one-level comments with the current demo author', () => {
    const post = createPostRecord('community-newton', { kind: 'local_update', title: 'Update', body: 'Details' }, '2026-11-07T22:00:00.000Z')
    const comment = createCommentRecord(post.id, 'Thanks for sharing.', '2026-11-07T22:05:00.000Z')
    expect(post.authorId).toBe(currentUserId)
    expect(post.communityId).toBe('community-newton')
    expect(comment.postId).toBe(post.id)
    expect(comment.authorId).toBe(currentUserId)
  })

  it('contains the curated BC communities', () => {
    expect(getCommunityBySlug('newton')?.municipality).toBe('Surrey')
    expect(communityCatalog.map((community) => community.slug)).toEqual(
      expect.arrayContaining(['guildford', 'fleetwood', 'cloverdale', 'city-centre', 'ladner', 'north-delta', 'burnaby-metrotown']),
    )
  })
})
