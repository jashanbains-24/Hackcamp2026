import type { HelpCategory } from '@/shared/types'

export interface RequestClaritySuggestion {
  title: string
  category: HelpCategory
  summary: string
  suggestedTags: string[]
  safetyNote: string
}

interface ClarityResponse {
  suggestion?: RequestClaritySuggestion
  error?: string
  code?: string
}

export class RequestClarityError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'RequestClarityError'
    this.code = code
  }
}

export async function clarifyHelpRequest(draft: string): Promise<RequestClaritySuggestion> {
  const response = await fetch('/api/help/clarify', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft }),
  })
  const payload = (await response.json().catch(() => ({}))) as ClarityResponse
  if (!response.ok || !payload.suggestion) {
    throw new RequestClarityError(
      payload.error ?? 'Request Clarity Assistant is unavailable. Continue with the manual form.',
      payload.code,
    )
  }
  return payload.suggestion
}
