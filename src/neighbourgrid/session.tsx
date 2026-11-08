import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth, useAuthUser, useMutations, useQuery } from 'deepspace'
import {
  communities,
  demoUser,
  homeCommunity as defaultHomeCommunity,
} from '@/shared/demo-data'
import type { Community, UserProfile } from '@/shared/types'
import {
  explicitlyLeftDemo,
  isDemoModePersisted,
  persistDemoMode,
  persistHomeCommunityId,
  readDemoFlagFromSearch,
  readStoredHomeCommunityId,
} from './demo-mode'

export type SessionMode = 'demo' | 'authenticated' | 'signed_out'

export type NeighbourGridSession = {
  mode: SessionMode
  isDemo: boolean
  isRegisteredRuntime: boolean
  isAuthLoaded: boolean
  userId: string | null
  profile: UserProfile
  displayName: string
  homeCommunity: Community
  homeCommunityId: string
  setHomeCommunityId: (communityId: string) => Promise<void>
  communitiesCatalog: Community[]
  enterDemoMode: () => void
  leaveDemoMode: () => void
}

type ProfileRow = {
  userId: string
  displayName: string
  homeCommunityId: string | null
  createdAt: string
}

type CommunityRow = {
  slug: string
  name: string
  municipality: string
  description: string
  visibility: Community['visibility']
  adjacentCommunityIds: string[]
  createdAt: string
}

const SessionContext = createContext<NeighbourGridSession | null>(null)

function greetingReadyName(name: string): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed : 'Neighbour'
}

function resolveCommunity(
  communityId: string | null | undefined,
  catalog: Community[],
): Community {
  return (
    catalog.find((community) => community.id === communityId) ??
    catalog[0] ??
    defaultHomeCommunity
  )
}

function useLocalDemoSession(forceDemo: boolean): NeighbourGridSession {
  const location = useLocation()
  const [, setTick] = useState(0)

  useEffect(() => {
    if (readDemoFlagFromSearch(location.search)) {
      persistDemoMode(true)
      setTick((value) => value + 1)
    }
  }, [location.search])

  const [homeCommunityId, setHomeId] = useState(
    () => readStoredHomeCommunityId() ?? demoUser.homeCommunityId ?? defaultHomeCommunity.id,
  )
  const homeCommunity = resolveCommunity(homeCommunityId, communities)

  const enterDemoMode = useCallback(() => {
    persistDemoMode(true)
    setTick((value) => value + 1)
  }, [])

  const leaveDemoMode = useCallback(() => {
    persistDemoMode(false)
    setTick((value) => value + 1)
  }, [])

  return {
    mode: forceDemo || isDemoModePersisted() ? 'demo' : 'signed_out',
    isDemo: true,
    isRegisteredRuntime: false,
    isAuthLoaded: true,
    userId: demoUser.id,
    profile: {
      ...demoUser,
      homeCommunityId: homeCommunity.id,
    },
    displayName: greetingReadyName(demoUser.displayName),
    homeCommunity,
    homeCommunityId: homeCommunity.id,
    setHomeCommunityId: async (communityId) => {
      persistHomeCommunityId(communityId)
      setHomeId(communityId)
    },
    communitiesCatalog: communities,
    enterDemoMode,
    leaveDemoMode,
  }
}

function useDeepSpaceSession(): NeighbourGridSession {
  const location = useLocation()
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { user } = useAuthUser()
  const [demoEpoch, setDemoEpoch] = useState(0)
  const [localHomeOverride, setLocalHomeOverride] = useState<string | null>(null)

  useEffect(() => {
    if (readDemoFlagFromSearch(location.search)) {
      persistDemoMode(true)
      setDemoEpoch((value) => value + 1)
    }
  }, [location.search])

  const demoMode = isDemoModePersisted() || readDemoFlagFromSearch(location.search)
  void demoEpoch

  const { records, status } = useQuery<ProfileRow>('profiles', {
    where: userId ? { userId } : undefined,
    limit: 1,
  })
  const { records: communityRecords } = useQuery<CommunityRow>('communities', {
    orderBy: 'name',
    orderDir: 'asc',
    limit: 50,
  })
  const { createConfirmed, putConfirmed, ready } = useMutations<ProfileRow>('profiles')

  const catalog = useMemo(() => {
    if (communityRecords.length === 0) return communities
    return communityRecords.map((record) => ({
      id: record.recordId,
      slug: record.data.slug,
      name: record.data.name,
      municipality: record.data.municipality,
      description: record.data.description,
      visibility: record.data.visibility,
      adjacentCommunityIds: record.data.adjacentCommunityIds ?? [],
      createdAt: record.data.createdAt,
    }))
  }, [communityRecords])

  const enterDemoMode = useCallback(() => {
    persistDemoMode(true)
    setDemoEpoch((value) => value + 1)
  }, [])

  const leaveDemoMode = useCallback(() => {
    persistDemoMode(false)
    setDemoEpoch((value) => value + 1)
  }, [])

  const profileRecord = records[0]
  const authName = greetingReadyName(
    user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'Neighbour',
  )

  useEffect(() => {
    if (demoMode || !isSignedIn || !userId || !ready || status !== 'ready') return
    if (profileRecord) return
    void createConfirmed({
      userId,
      displayName: authName,
      homeCommunityId: readStoredHomeCommunityId() ?? defaultHomeCommunity.id,
      createdAt: new Date().toISOString(),
    }).catch(() => {
      // Toasts come from RecordProvider onWriteError.
    })
  }, [
    authName,
    createConfirmed,
    demoMode,
    isSignedIn,
    profileRecord,
    ready,
    status,
    userId,
  ])

  if (demoMode) {
    const storedId =
      localHomeOverride ?? readStoredHomeCommunityId() ?? demoUser.homeCommunityId ?? defaultHomeCommunity.id
    const homeCommunity = resolveCommunity(storedId, catalog)
    return {
      mode: 'demo',
      isDemo: true,
      isRegisteredRuntime: true,
      isAuthLoaded: true,
      userId: demoUser.id,
      profile: { ...demoUser, homeCommunityId: homeCommunity.id },
      displayName: greetingReadyName(demoUser.displayName),
      homeCommunity,
      homeCommunityId: homeCommunity.id,
      setHomeCommunityId: async (communityId) => {
        persistHomeCommunityId(communityId)
        setLocalHomeOverride(communityId)
      },
      communitiesCatalog: catalog,
      enterDemoMode,
      leaveDemoMode,
    }
  }

  if (!isLoaded) {
    return {
      mode: 'signed_out',
      isDemo: false,
      isRegisteredRuntime: true,
      isAuthLoaded: false,
      userId: null,
      profile: demoUser,
      displayName: 'Neighbour',
      homeCommunity: defaultHomeCommunity,
      homeCommunityId: defaultHomeCommunity.id,
      setHomeCommunityId: async () => undefined,
      communitiesCatalog: catalog,
      enterDemoMode,
      leaveDemoMode,
    }
  }

  if (!isSignedIn || !userId) {
    // Signed-out browsing stays on the fenced Maya demo account unless the
    // visitor explicitly left demo mode this session (then Profile can sign in).
    const useDemoFence = demoMode || !explicitlyLeftDemo()
    const storedId =
      localHomeOverride ??
      readStoredHomeCommunityId() ??
      (useDemoFence ? demoUser.homeCommunityId : null) ??
      defaultHomeCommunity.id
    const homeCommunity = resolveCommunity(storedId, catalog)
    if (useDemoFence) {
      return {
        mode: 'demo',
        isDemo: true,
        isRegisteredRuntime: true,
        isAuthLoaded: true,
        userId: demoUser.id,
        profile: { ...demoUser, homeCommunityId: homeCommunity.id },
        displayName: greetingReadyName(demoUser.displayName),
        homeCommunity,
        homeCommunityId: homeCommunity.id,
        setHomeCommunityId: async (communityId) => {
          persistHomeCommunityId(communityId)
          setLocalHomeOverride(communityId)
        },
        communitiesCatalog: catalog,
        enterDemoMode,
        leaveDemoMode,
      }
    }
    return {
      mode: 'signed_out',
      isDemo: false,
      isRegisteredRuntime: true,
      isAuthLoaded: true,
      userId: null,
      profile: {
        id: 'signed-out',
        displayName: 'Neighbour',
        homeCommunityId: homeCommunity.id,
        createdAt: new Date().toISOString(),
      },
      displayName: 'Neighbour',
      homeCommunity,
      homeCommunityId: homeCommunity.id,
      setHomeCommunityId: async (communityId) => {
        persistHomeCommunityId(communityId)
        setLocalHomeOverride(communityId)
      },
      communitiesCatalog: catalog,
      enterDemoMode,
      leaveDemoMode,
    }
  }

  const homeCommunityId =
    localHomeOverride ??
    profileRecord?.data.homeCommunityId ??
    readStoredHomeCommunityId() ??
    defaultHomeCommunity.id
  const homeCommunity = resolveCommunity(homeCommunityId, catalog)
  const displayName = greetingReadyName(profileRecord?.data.displayName ?? authName)

  return {
    mode: 'authenticated',
    isDemo: false,
    isRegisteredRuntime: true,
    isAuthLoaded: true,
    userId,
    profile: {
      id: userId,
      displayName,
      homeCommunityId: homeCommunity.id,
      createdAt: profileRecord?.data.createdAt ?? new Date().toISOString(),
    },
    displayName,
    homeCommunity,
    homeCommunityId: homeCommunity.id,
    setHomeCommunityId: async (communityId) => {
      persistHomeCommunityId(communityId)
      setLocalHomeOverride(communityId)
      if (profileRecord && ready) {
        await putConfirmed(profileRecord.recordId, { homeCommunityId: communityId })
      }
    },
    communitiesCatalog: catalog,
    enterDemoMode,
    leaveDemoMode,
  }
}

/** Mount inside RecordProvider (registered DeepSpace runtime only). */
export function NeighbourGridSessionProvider({ children }: { children: ReactNode }) {
  const value = useDeepSpaceSession()
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

/**
 * Prefer provider session when available; otherwise a local demo fence for
 * unregistered/mock Vite previews.
 */
export function useNeighbourGridSession(): NeighbourGridSession {
  const ctx = useContext(SessionContext)
  const fallback = useLocalDemoSession(true)
  return ctx ?? fallback
}
