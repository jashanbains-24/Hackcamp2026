import { getAuthToken } from 'deepspace'

export type GuideTurn = {
  role: 'user' | 'assistant'
  content: string
}

export type GuideAppContext = {
  source: 'demo' | 'live' | 'empty'
  homeCommunity: {
    name: string
    municipality: string
  }
  communities: Array<{
    name: string
    municipality: string
    visibility: 'public' | 'request_to_join'
  }>
  recentPosts: Array<{
    title: string
    kind: string
    createdAt: string
  }>
  recentHelp: Array<{
    title: string
    kind: string
    status: string
    createdAt: string
    demo: boolean
  }>
}

export type GuideSource = {
  title: string
  url: string
}

export type GuideAnswer = {
  answer: string
  sources: GuideSource[]
  searchedWeb: boolean
  searchNote: string | null
  searchQueries: string[]
  officialFetchedAt: string
}

type GuideError = {
  error?: string
  code?: string
}

export async function askNeighbourhoodGuide(input: {
  message: string
  history: GuideTurn[]
  appContext: GuideAppContext
  searchWeb: boolean
}): Promise<GuideAnswer> {
  const token = await getAuthToken()

  const response = await fetch('/api/assistant/ask', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  })

  const payload = (await response.json().catch(() => ({}))) as GuideAnswer & GuideError
  if (!response.ok) {
    throw new Error(payload.error || 'Neighbourhood Guide could not answer that question.')
  }
  return payload
}
