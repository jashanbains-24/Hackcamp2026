import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAuthToken } from 'deepspace'
import { askNeighbourhoodGuide } from './neighbourhood-guide'

vi.mock('deepspace', () => ({
  getAuthToken: vi.fn(),
}))

const input = {
  message: 'What is happening nearby?',
  history: [],
  searchWeb: true,
  appContext: {
    source: 'live' as const,
    homeCommunity: { name: 'Newton', municipality: 'Surrey' },
    communities: [],
    recentPosts: [],
    recentHelp: [],
  },
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('askNeighbourhoodGuide', () => {
  it('sends the signed-in user bearer token to the assistant route', async () => {
    vi.mocked(getAuthToken).mockResolvedValue('test-jwt')
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          answer: 'No current updates were found.',
          sources: [],
          searchedWeb: true,
          searchNote: null,
          searchQueries: [],
          officialFetchedAt: new Date(0).toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(askNeighbourhoodGuide(input)).resolves.toMatchObject({
      answer: 'No current updates were found.',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/assistant/ask',
      expect.objectContaining({
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-jwt',
        },
      }),
    )
  })

  it('uses the signed-in session cookie when no bearer token is available', async () => {
    vi.mocked(getAuthToken).mockResolvedValue(null)
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          answer: 'No current updates were found.',
          sources: [],
          searchedWeb: true,
          searchNote: null,
          searchQueries: [],
          officialFetchedAt: new Date(0).toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(askNeighbourhoodGuide(input)).resolves.toMatchObject({
      answer: 'No current updates were found.',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/assistant/ask',
      expect.objectContaining({
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })
})
