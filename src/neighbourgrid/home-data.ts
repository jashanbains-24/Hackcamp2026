import { useMemo } from 'react'
import { useQuery } from 'deepspace'
import { demoHelpItems, demoPosts, postAuthors } from '@/shared/demo-data'
import type { HelpItem, Post } from '@/shared/types'
import type { NeighbourGridSession } from './session'

export type HomePostPreview = {
  id: string
  title: string
  kindLabel: string
  authorLabel: string
  createdAt: string
  communitySlug: string
}

export type HomeHelpPreview = {
  id: string
  title: string
  kindLabel: string
  statusLabel: string
  demo: boolean
  createdAt: string
}

export type HomeActivityItem = {
  id: string
  title: string
  detail: string
  href: string
  at: string
  tone: 'community' | 'help' | 'demo'
}

export type HomeAggregates = {
  source: 'demo' | 'live' | 'empty'
  postCount: number
  openHelpCount: number
  latestPosts: HomePostPreview[]
  latestHelp: HomeHelpPreview[]
  activity: HomeActivityItem[]
  status: 'loading' | 'ready' | 'error' | 'demo'
  error?: string
}

function kindLabel(kind: Post['kind']): string {
  if (kind === 'resource_offer') return 'Resource offer'
  if (kind === 'local_update') return 'Local update'
  return 'Discussion'
}

function helpKindLabel(kind: HelpItem['kind']): string {
  if (kind === 'offer') return 'Offer'
  if (kind === 'beacon') return 'Beacon'
  return 'Request'
}

/** Same wording as the Help card's status chip, so Activity never shows a raw key. */
const helpStatusLabels: Record<HelpItem['status'], string> = {
  open: 'Open',
  offered: 'Help offered',
  matched: 'Matched',
  resolved: 'Resolved',
  cancelled: 'Cancelled',
}

declare const __DEEPSPACE_REGISTERED__: boolean

export function useHomeAggregates(session: NeighbourGridSession): HomeAggregates {
  const useLive = __DEEPSPACE_REGISTERED__ && session.mode === 'authenticated'

  const postsQuery = useQuery<{
    communityId: string
    authorId: string
    kind: Post['kind']
    title: string
    body: string
    createdAt: string
    updatedAt: string
  }>('posts', {
    where: { communityId: session.homeCommunityId },
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 8,
  })

  const helpQuery = useQuery<{
    communityId: string
    authorId: string
    kind: HelpItem['kind']
    title: string
    description: string
    category: HelpItem['category']
    status: HelpItem['status']
    demo: boolean
    targetCommunityIds: string[]
    createdAt: string
    updatedAt: string
  }>('help_items', {
    where: { communityId: session.homeCommunityId },
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 8,
  })

  return useMemo(() => {
    if (session.isDemo || !useLive) {
      const posts = demoPosts.filter((post) => post.communityId === session.homeCommunityId)
      const help = demoHelpItems.filter((item) => item.communityId === session.homeCommunityId)
      return {
        source: 'demo',
        status: 'demo',
        postCount: posts.length,
        openHelpCount: help.filter((item) => item.status === 'open' || item.status === 'offered').length,
        latestPosts: posts.map((post) => ({
          id: post.id,
          title: post.title,
          kindLabel: kindLabel(post.kind),
          authorLabel: postAuthors[post.authorId] ?? 'Neighbour',
          createdAt: post.createdAt,
          communitySlug: session.homeCommunity.slug,
        })),
        latestHelp: help.map((item) => ({
          id: item.id,
          title: item.title,
          kindLabel: helpKindLabel(item.kind),
          statusLabel: item.status,
          demo: item.demo,
          createdAt: item.createdAt,
        })),
        activity: buildActivity(posts, help, session.homeCommunity.slug),
      }
    }

    if (postsQuery.status === 'loading' || helpQuery.status === 'loading') {
      return {
        source: 'live',
        status: 'loading',
        postCount: 0,
        openHelpCount: 0,
        latestPosts: [],
        latestHelp: [],
        activity: [],
      }
    }

    if (postsQuery.status === 'error' || helpQuery.status === 'error') {
      return {
        source: 'live',
        status: 'error',
        postCount: 0,
        openHelpCount: 0,
        latestPosts: [],
        latestHelp: [],
        activity: [],
        error: postsQuery.error ?? helpQuery.error ?? 'Could not load neighbourhood activity.',
      }
    }

    const posts: Post[] = postsQuery.records.map((record) => ({
      id: record.recordId,
      communityId: record.data.communityId,
      authorId: record.data.authorId,
      kind: record.data.kind,
      title: record.data.title,
      body: record.data.body,
      createdAt: record.data.createdAt,
      updatedAt: record.data.updatedAt,
    }))

    const help: HelpItem[] = helpQuery.records.map((record) => ({
      id: record.recordId,
      communityId: record.data.communityId,
      authorId: record.data.authorId,
      kind: record.data.kind,
      title: record.data.title,
      description: record.data.description,
      category: record.data.category,
      status: record.data.status,
      demo: Boolean(record.data.demo),
      targetCommunityIds: record.data.targetCommunityIds ?? [],
      createdAt: record.data.createdAt,
      updatedAt: record.data.updatedAt,
    }))

    return {
      source: posts.length === 0 && help.length === 0 ? 'empty' : 'live',
      status: 'ready',
      postCount: posts.length,
      openHelpCount: help.filter((item) => item.status === 'open' || item.status === 'offered').length,
      latestPosts: posts.slice(0, 3).map((post) => ({
        id: post.id,
        title: post.title,
        kindLabel: kindLabel(post.kind),
        authorLabel: 'Neighbour',
        createdAt: post.createdAt,
        communitySlug: session.homeCommunity.slug,
      })),
      latestHelp: help.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.title,
        kindLabel: helpKindLabel(item.kind),
        statusLabel: item.status,
        demo: item.demo,
        createdAt: item.createdAt,
      })),
      activity: buildActivity(posts, help, session.homeCommunity.slug),
    }
  }, [
    helpQuery.error,
    helpQuery.records,
    helpQuery.status,
    postsQuery.error,
    postsQuery.records,
    postsQuery.status,
    session.homeCommunity.slug,
    session.homeCommunityId,
    session.isDemo,
    useLive,
  ])
}

function buildActivity(
  posts: Post[],
  help: HelpItem[],
  communitySlug: string,
): HomeActivityItem[] {
  const items: HomeActivityItem[] = [
    ...posts.map((post) => ({
      id: `post-${post.id}`,
      title: post.title,
      detail: kindLabel(post.kind),
      href: `/app/communities/${communitySlug}`,
      at: post.createdAt,
      tone: 'community' as const,
    })),
    ...help.map((item) => ({
      id: `help-${item.id}`,
      title: item.title,
      detail: `${helpKindLabel(item.kind)} · ${helpStatusLabels[item.status]}`,
      href: '/app/help',
      at: item.createdAt,
      tone: item.demo ? ('demo' as const) : ('help' as const),
    })),
  ]
  return items.sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, 12)
}
