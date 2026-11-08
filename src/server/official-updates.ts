/**
 * BC Hydro Surrey unplanned-outage RSS — verified from the official index:
 * https://www.bchydro.com/safety-outages/power-outages/outages_rss.html
 * → municipality link "Surrey" → https://www.bchydro.com/rss/outages/surrey.xml
 *
 * Municipality-level only. Never claim a Surrey item is specifically in Newton
 * without a verified neighbourhood field (this feed does not provide one).
 */

import type { OfficialUpdate } from '../shared/types.js'

export const BC_HYDRO_OUTAGES_INDEX_URL =
  'https://www.bchydro.com/safety-outages/power-outages/outages_rss.html'

/** Verified municipality feed URL from the official index (not invented). */
export const BC_HYDRO_SURREY_FEED_URL = 'https://www.bchydro.com/rss/outages/surrey.xml'

export const BC_HYDRO_SOURCE_NAME = 'BC Hydro'
export const OFFICIAL_UPDATES_CACHE_MS = 15 * 60 * 1000

export type OfficialUpdatesResponse = {
  status: 'ok' | 'empty' | 'error'
  sourceName: string
  sourceUrl: string
  feedUrl: string
  indexUrl: string
  fetchedAt: string
  cacheExpiresAt: string
  municipalityNote: string
  updates: OfficialUpdate[]
  errorMessage?: string
}

type CacheEntry = {
  storedAt: number
  payload: OfficialUpdatesResponse
}

let cache: CacheEntry | null = null

export function stripHtml(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function firstMatch(block: string, pattern: RegExp): string | null {
  const match = block.match(pattern)
  return match?.[1]?.trim() ?? null
}

function decodeXmlText(value: string): string {
  return stripHtml(value)
}

export function parseBcHydroOutageItems(
  xml: string,
  fetchedAt: string,
): OfficialUpdate[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? []
  const updates: OfficialUpdate[] = []

  for (const item of items) {
    const guid = firstMatch(item, /<guid\b[^>]*>([\s\S]*?)<\/guid>/i)
    const titleRaw = firstMatch(item, /<title\b[^>]*>([\s\S]*?)<\/title>/i)
    const link = firstMatch(item, /<link\b[^>]*>([\s\S]*?)<\/link>/i)
    const pubDate = firstMatch(item, /<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i)
    const descriptionRaw = firstMatch(item, /<description\b[^>]*>([\s\S]*?)<\/description>/i)
    if (!titleRaw) continue

    const title = decodeXmlText(titleRaw)
    const description = descriptionRaw ? stripHtml(descriptionRaw) : title
    const lowerTitle = title.toLowerCase()
    let status: OfficialUpdate['status'] = 'unknown'
    if (lowerTitle.includes('restored')) status = 'restored'
    else if (lowerTitle.includes('current')) status = 'current'
    else if (lowerTitle.includes('advisory')) status = 'advisory'

    const municipality =
      firstMatch(description, /Municipality:\s*([^\n]+)/i)?.trim() ?? 'Surrey'

    const idSource = guid && guid !== 'null' ? guid : `${title}|${pubDate ?? ''}`
    updates.push({
      id: `bchydro-surrey-${hashId(idSource)}`,
      sourceName: BC_HYDRO_SOURCE_NAME,
      sourceUrl: link?.startsWith('http') ? link : BC_HYDRO_SURREY_FEED_URL,
      title,
      description,
      municipality,
      status,
      publishedAt: pubDate ? toIsoOrNull(pubDate) : null,
      fetchedAt,
      isDemo: false,
    })
  }

  return dedupeById(updates)
}

function hashId(value: string): string {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash.toString(36)
}

function toIsoOrNull(value: string): string | null {
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return null
  return new Date(parsed).toISOString()
}

function dedupeById(updates: OfficialUpdate[]): OfficialUpdate[] {
  const seen = new Set<string>()
  const out: OfficialUpdate[] = []
  for (const update of updates) {
    if (seen.has(update.id)) continue
    seen.add(update.id)
    out.push(update)
  }
  return out
}

function basePayload(
  fetchedAt: string,
  status: OfficialUpdatesResponse['status'],
  errorMessage?: string,
): OfficialUpdatesResponse {
  const expires = new Date(Date.parse(fetchedAt) + OFFICIAL_UPDATES_CACHE_MS).toISOString()
  return {
    status,
    sourceName: BC_HYDRO_SOURCE_NAME,
    sourceUrl: 'https://www.bchydro.com/safety-outages/power-outages.html',
    feedUrl: BC_HYDRO_SURREY_FEED_URL,
    indexUrl: BC_HYDRO_OUTAGES_INDEX_URL,
    fetchedAt,
    cacheExpiresAt: expires,
    municipalityNote:
      'BC Hydro labels these items at the Surrey municipality level. They are not verified as Newton-specific.',
    updates: [],
    errorMessage,
  }
}

export function clearOfficialUpdatesCacheForTests(): void {
  cache = null
}

export async function getOfficialUpdates(options?: {
  forceRefresh?: boolean
  fetchImpl?: typeof fetch
}): Promise<OfficialUpdatesResponse> {
  const now = Date.now()
  if (!options?.forceRefresh && cache && now - cache.storedAt < OFFICIAL_UPDATES_CACHE_MS) {
    return cache.payload
  }

  const fetchedAt = new Date(now).toISOString()
  const fetchImpl = options?.fetchImpl ?? fetch

  try {
    const response = await fetchImpl(BC_HYDRO_SURREY_FEED_URL, {
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'NeighbourGrid/0.1 (HackCamp prototype; official-updates)',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      const payload = basePayload(
        fetchedAt,
        'error',
        `BC Hydro feed returned HTTP ${response.status}.`,
      )
      cache = { storedAt: now, payload }
      return payload
    }

    const xml = await response.text()
    const updates = parseBcHydroOutageItems(xml, fetchedAt)
    const payload: OfficialUpdatesResponse = {
      ...basePayload(fetchedAt, updates.length === 0 ? 'empty' : 'ok'),
      updates,
      errorMessage: undefined,
    }
    cache = { storedAt: now, payload }
    return payload
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not reach the BC Hydro feed.'
    const payload = basePayload(fetchedAt, 'error', message)
    // Cache failures briefly so a down feed does not stampede.
    cache = { storedAt: now, payload }
    return payload
  }
}
