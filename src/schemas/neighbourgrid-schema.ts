/**
 * NeighbourGrid product collections.
 *
 * Person A owns this file. B/C propose diffs before depending on new fields or
 * permission changes. Column names mirror `src/shared/types.ts` — do not rename
 * shared TypeScript interfaces to match storage.
 *
 * Identity rule: `userId`, `authorId`, and `responderId` columns marked
 * `userBound: true` are stamped from the authenticated session on the Durable
 * Object. Clients cannot forge another user's identity on write.
 */

import type { CollectionSchema } from 'deepspace/schema'

const memberOwnWrite = {
  read: true as const,
  create: true,
  update: 'own' as const,
  delete: 'own' as const,
}

const publicReadOnly = {
  read: true as const,
  create: false,
  update: false,
  delete: false,
}

/** One profile row per authenticated user. `userId` equals `UserProfile.id`. */
export const profilesSchema: CollectionSchema = {
  name: 'profiles',
  columns: [
    {
      name: 'userId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
    {
      name: 'displayName',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      maxLength: 80,
    },
    { name: 'homeCommunityId', storage: 'text', interpretation: 'plain' },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  ownerField: 'userId',
  uniqueOn: ['userId'],
  permissions: {
    viewer: publicReadOnly,
    member: {
      ...memberOwnWrite,
      writableFields: ['displayName', 'homeCommunityId', 'createdAt'],
    },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const communitiesSchema: CollectionSchema = {
  name: 'communities',
  columns: [
    { name: 'slug', storage: 'text', interpretation: 'plain', required: true, immutable: true },
    { name: 'name', storage: 'text', interpretation: 'plain', required: true, maxLength: 120 },
    {
      name: 'municipality',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      maxLength: 120,
    },
    {
      name: 'description',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      maxLength: 2000,
    },
    {
      name: 'visibility',
      storage: 'text',
      interpretation: { kind: 'select', options: ['public', 'request_to_join'] },
      required: true,
    },
    {
      name: 'adjacentCommunityIds',
      storage: 'text',
      interpretation: { kind: 'json' },
      required: true,
    },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  uniqueOn: ['slug'],
  permissions: {
    '*': publicReadOnly,
    viewer: publicReadOnly,
    member: publicReadOnly,
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const membershipsSchema: CollectionSchema = {
  name: 'memberships',
  columns: [
    {
      name: 'userId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
    {
      name: 'communityId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      immutable: true,
    },
    {
      name: 'status',
      storage: 'text',
      interpretation: { kind: 'select', options: ['pending', 'approved', 'rejected'] },
      required: true,
    },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  ownerField: 'userId',
  uniqueOn: ['userId', 'communityId'],
  permissions: {
    viewer: { read: 'own', create: false, update: false, delete: false },
    member: {
      read: true,
      create: true,
      update: 'own',
      delete: 'own',
      writableFields: ['communityId', 'status', 'createdAt'],
    },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const postsSchema: CollectionSchema = {
  name: 'posts',
  columns: [
    {
      name: 'communityId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      immutable: true,
    },
    {
      name: 'authorId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
    {
      name: 'kind',
      storage: 'text',
      interpretation: {
        kind: 'select',
        options: ['discussion', 'local_update', 'resource_offer'],
      },
      required: true,
    },
    { name: 'title', storage: 'text', interpretation: 'plain', required: true, maxLength: 200 },
    { name: 'body', storage: 'text', interpretation: 'plain', required: true, maxLength: 8000 },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
    {
      name: 'updatedAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  ownerField: 'authorId',
  permissions: {
    '*': publicReadOnly,
    viewer: publicReadOnly,
    member: {
      ...memberOwnWrite,
      writableFields: ['kind', 'title', 'body', 'communityId', 'createdAt', 'updatedAt'],
    },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const commentsSchema: CollectionSchema = {
  name: 'comments',
  columns: [
    {
      name: 'postId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      immutable: true,
    },
    {
      name: 'authorId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
    { name: 'body', storage: 'text', interpretation: 'plain', required: true, maxLength: 4000 },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  ownerField: 'authorId',
  permissions: {
    '*': publicReadOnly,
    viewer: publicReadOnly,
    member: {
      ...memberOwnWrite,
      writableFields: ['postId', 'body', 'createdAt'],
    },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const helpItemsSchema: CollectionSchema = {
  name: 'help_items',
  columns: [
    {
      name: 'communityId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      immutable: true,
    },
    {
      name: 'authorId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
    {
      name: 'kind',
      storage: 'text',
      interpretation: { kind: 'select', options: ['request', 'offer', 'beacon'] },
      required: true,
    },
    { name: 'title', storage: 'text', interpretation: 'plain', required: true, maxLength: 200 },
    {
      name: 'description',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      maxLength: 8000,
    },
    {
      name: 'category',
      storage: 'text',
      interpretation: {
        kind: 'select',
        options: [
          'power_charging',
          'supplies',
          'mobility_accessibility',
          'transportation',
          'wellness_checkin',
          'other',
        ],
      },
      required: true,
    },
    {
      name: 'status',
      storage: 'text',
      interpretation: {
        kind: 'select',
        options: ['open', 'offered', 'matched', 'resolved', 'cancelled'],
      },
      required: true,
    },
    { name: 'demo', storage: 'number', interpretation: { kind: 'boolean' }, required: true },
    {
      name: 'targetCommunityIds',
      storage: 'text',
      interpretation: { kind: 'json' },
      required: true,
    },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
    {
      name: 'updatedAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  ownerField: 'authorId',
  permissions: {
    viewer: publicReadOnly,
    // Help lifecycle writes are orchestrated by authenticated server actions.
    // This prevents clients from skipping status transitions or beacon cooldowns.
    member: publicReadOnly,
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const helpResponsesSchema: CollectionSchema = {
  name: 'help_responses',
  columns: [
    {
      name: 'helpItemId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      immutable: true,
    },
    {
      name: 'responderId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
    { name: 'note', storage: 'text', interpretation: 'plain', required: true, maxLength: 2000 },
    {
      name: 'acceptedByRequester',
      storage: 'number',
      interpretation: { kind: 'boolean' },
      required: true,
    },
    {
      name: 'createdAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
  ],
  ownerField: 'responderId',
  uniqueOn: ['helpItemId', 'responderId'],
  permissions: {
    viewer: { read: false, create: false, update: false, delete: false },
    // Only help server actions may create or accept responses. Members can
    // read the short public notes but cannot forge requester acceptance.
    member: { read: true, create: false, update: false, delete: false },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

/**
 * Optional persisted official updates. The live home path prefers the
 * `/api/official-updates` Worker cache; this collection is available if B/C
 * need a durable copy later. Writes stay admin/server-only.
 */
export const officialUpdatesSchema: CollectionSchema = {
  name: 'official_updates',
  columns: [
    { name: 'sourceName', storage: 'text', interpretation: 'plain', required: true },
    { name: 'sourceUrl', storage: 'text', interpretation: { kind: 'url' }, required: true },
    { name: 'title', storage: 'text', interpretation: 'plain', required: true, maxLength: 300 },
    {
      name: 'description',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      maxLength: 8000,
    },
    { name: 'municipality', storage: 'text', interpretation: 'plain' },
    {
      name: 'status',
      storage: 'text',
      interpretation: {
        kind: 'select',
        options: ['current', 'restored', 'advisory', 'unknown'],
      },
      required: true,
    },
    { name: 'publishedAt', storage: 'text', interpretation: { kind: 'datetime' } },
    {
      name: 'fetchedAt',
      storage: 'text',
      interpretation: { kind: 'datetime' },
      required: true,
    },
    { name: 'isDemo', storage: 'number', interpretation: { kind: 'boolean' }, required: true },
  ],
  permissions: {
    '*': publicReadOnly,
    viewer: publicReadOnly,
    member: publicReadOnly,
    admin: { read: true, create: true, update: true, delete: true },
  },
}

export const neighbourgridSchemas: CollectionSchema[] = [
  profilesSchema,
  communitiesSchema,
  membershipsSchema,
  postsSchema,
  commentsSchema,
  helpItemsSchema,
  helpResponsesSchema,
  officialUpdatesSchema,
]
