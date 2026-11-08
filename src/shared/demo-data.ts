import type { Community, HelpItem, OfficialUpdate, Post, UserProfile } from './types'

export const demoUser: UserProfile = {
  id: 'demo-user-maya',
  displayName: 'Maya',
  homeCommunityId: 'community-newton',
  createdAt: '2026-11-07T20:00:00.000Z',
}

export const communities: Community[] = [
  {
    id: 'community-newton',
    slug: 'newton',
    name: 'Newton',
    municipality: 'Surrey',
    description: 'Local conversations, practical support, and neighbourly updates.',
    visibility: 'public',
    adjacentCommunityIds: ['community-fleetwood', 'community-city-centre'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
  {
    id: 'community-fleetwood',
    slug: 'fleetwood',
    name: 'Fleetwood',
    municipality: 'Surrey',
    description: 'Connect around community life, resources, and local questions.',
    visibility: 'public',
    adjacentCommunityIds: ['community-newton', 'community-guildford'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
  {
    id: 'community-guildford',
    slug: 'guildford',
    name: 'Guildford',
    municipality: 'Surrey',
    description: 'A welcoming space for Guildford neighbours to stay connected.',
    visibility: 'request_to_join',
    adjacentCommunityIds: ['community-fleetwood'],
    createdAt: '2026-11-07T20:00:00.000Z',
  },
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

export const homeCommunity = communities[0]

/** Fictional demo figures for the communities list. Not a live member count. */
export const demoMemberCounts: Record<string, number> = {
  'community-newton': 186,
  'community-fleetwood': 142,
  'community-guildford': 97,
  'community-cloverdale': 118,
  'community-city-centre': 231,
  'community-ladner': 64,
  'community-north-delta': 109,
  'community-burnaby-metrotown': 154,
}

export const demoPosts: Post[] = [
  {
    id: 'post-library-hours',
    communityId: 'community-newton',
    authorId: 'demo-user-aisha',
    kind: 'discussion',
    title: 'Favourite quiet spots to work nearby?',
    body: 'Looking for a calm place with outlets for an hour or two this week.',
    createdAt: '2026-11-07T22:18:00.000Z',
    updatedAt: '2026-11-07T22:18:00.000Z',
  },
  {
    id: 'post-extra-lanterns',
    communityId: 'community-newton',
    authorId: 'demo-user-daniel',
    kind: 'resource_offer',
    title: 'Two spare battery lanterns available',
    body: 'Happy to lend these for the simulated preparedness exercise tonight.',
    createdAt: '2026-11-07T21:42:00.000Z',
    updatedAt: '2026-11-07T21:42:00.000Z',
  },
]

export const postAuthors: Record<string, string> = {
  'demo-user-aisha': 'Aisha K.',
  'demo-user-daniel': 'Daniel R.',
}

export const demoHelpItems: HelpItem[] = [
  {
    id: 'help-power-bank',
    communityId: 'community-newton',
    authorId: 'demo-user-maya',
    kind: 'request',
    title: 'Need a phone power bank for two hours',
    description:
      'SIMULATED SCENARIO: Looking for a loaner power bank nearby while practising outage prep.',
    category: 'power_charging',
    status: 'open',
    demo: true,
    targetCommunityIds: ['community-newton'],
    createdAt: '2026-11-07T22:05:00.000Z',
    updatedAt: '2026-11-07T22:05:00.000Z',
  },
  {
    id: 'help-spare-torches',
    communityId: 'community-newton',
    authorId: 'demo-user-daniel',
    kind: 'offer',
    title: 'Extra LED torches to lend',
    description: 'Fictional offer for the demo preparedness exercise.',
    category: 'supplies',
    status: 'open',
    demo: true,
    targetCommunityIds: ['community-newton'],
    createdAt: '2026-11-07T21:20:00.000Z',
    updatedAt: '2026-11-07T21:20:00.000Z',
  },
]

export const demoOfficialState: OfficialUpdate = {
  id: 'official-empty-state',
  sourceName: 'BC Hydro',
  sourceUrl: 'https://www.bchydro.com/safety-outages/power-outages.html',
  title: 'No verified local outage updates available',
  description:
    'Live local updates are not connected in this Phase 0 preview. Check the official source for current information.',
  municipality: 'Surrey',
  status: 'unknown',
  publishedAt: null,
  fetchedAt: '2026-11-07T23:00:00.000Z',
  isDemo: false,
}

export const resourceLinks = [
  {
    eyebrow: 'Before',
    title: 'Build an emergency plan',
    source: 'PreparedBC',
    url: 'https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc',
  },
  {
    eyebrow: 'During',
    title: 'Understand power outages',
    source: 'BC Hydro',
    url: 'https://www.bchydro.com/safety-outages/power-outages.html',
  },
  {
    eyebrow: 'After',
    title: 'Check official BC updates',
    source: 'EmergencyInfoBC',
    url: 'https://www.emergencyinfobc.gov.bc.ca/',
  },
] as const
