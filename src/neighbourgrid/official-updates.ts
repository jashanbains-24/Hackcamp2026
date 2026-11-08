import { useCallback, useEffect, useState } from 'react'
import type { OfficialUpdate } from '@/shared/types'
import type { OfficialUpdatesResponse } from '@/server/official-updates'

export type OfficialUpdatesState = {
  status: 'loading' | 'ok' | 'empty' | 'error' | 'unavailable'
  data: OfficialUpdatesResponse | null
  refresh: () => void
}

const FALLBACK: OfficialUpdatesResponse = {
  status: 'error',
  sourceName: 'BC Hydro',
  sourceUrl: 'https://www.bchydro.com/safety-outages/power-outages.html',
  feedUrl: 'https://www.bchydro.com/rss/outages/surrey.xml',
  indexUrl: 'https://www.bchydro.com/safety-outages/power-outages/outages_rss.html',
  fetchedAt: new Date(0).toISOString(),
  cacheExpiresAt: new Date(0).toISOString(),
  municipalityNote:
    'BC Hydro labels these items at the Surrey municipality level. They are not verified as Newton-specific.',
  updates: [] as OfficialUpdate[],
  errorMessage: 'Official updates API is unavailable in this runtime.',
}

export function useOfficialUpdates(): OfficialUpdatesState {
  const [status, setStatus] = useState<OfficialUpdatesState['status']>('loading')
  const [data, setData] = useState<OfficialUpdatesResponse | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => {
    setNonce((value) => value + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load() {
      setStatus('loading')
      try {
        const response = await fetch(
          nonce > 0 ? '/api/official-updates?refresh=1' : '/api/official-updates',
          { signal: controller.signal },
        )
        if (!response.ok && response.status !== 503) {
          throw new Error(`HTTP ${response.status}`)
        }
        const payload = (await response.json()) as OfficialUpdatesResponse
        if (cancelled) return
        setData(payload)
        if (payload.status === 'ok') setStatus('ok')
        else if (payload.status === 'empty') setStatus('empty')
        else setStatus('error')
      } catch {
        if (cancelled) return
        setData({
          ...FALLBACK,
          fetchedAt: new Date().toISOString(),
          cacheExpiresAt: new Date().toISOString(),
        })
        setStatus('unavailable')
      }
    }

    void load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [nonce])

  return { status, data, refresh }
}
