import type { Hono } from 'hono'
import { z } from 'zod'
import type { AppContext, Env } from '../../worker.js'
import { resolveBrowserAuth } from './http-routes.js'

const requestSchema = z.object({
  draft: z.string().trim().min(12).max(1000),
  kind: z.enum(['request', 'offer', 'beacon']).default('request'),
})

const claritySchema = z.object({
  title: z.string().trim().min(5).max(80),
  category: z.enum([
    'power_charging',
    'supplies',
    'mobility_accessibility',
    'transportation',
    'wellness_checkin',
    'other',
  ]),
  summary: z.string().trim().min(12).max(500),
  suggestedTags: z.array(z.string().trim().min(1).max(24)).max(4),
  safetyNote: z.string().trim().min(5).max(180),
})

type GeminiEnv = Env & {
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

export function registerHelpRoutes(app: Hono<AppContext>): void {
  app.post('/api/help/clarify', async (c) => {
    const auth = await resolveBrowserAuth(c.req.raw, c.env)
    if (!auth) {
      return c.json(
        { error: 'Sign in before using the writing assistant.', code: 'unauthorized' },
        401,
      )
    }

    const parsedRequest = requestSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsedRequest.success) {
      return c.json(
        { error: 'Enter a short draft between 12 and 1,000 characters.', code: 'invalid_input' },
        400,
      )
    }

    const env = c.env as GeminiEnv
    if (!env.GEMINI_API_KEY) {
      return c.json(
        {
          error: 'Gemini is not configured yet. The manual form still works.',
          code: 'configuration_missing',
        },
        503,
      )
    }

    const model = env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
    const prompt = [
      parsedRequest.data.kind === 'offer'
        ? 'You help a user rewrite an ordinary neighbourhood offer of something they can lend or share. Keep it as an offer from the neighbour. Do not turn it into a request.'
        : parsedRequest.data.kind === 'beacon'
          ? 'You help a user rewrite a short public neighbourhood beacon. Keep it as a practical ask for neighbours, and keep the summary under 280 characters. Do not turn it into an emergency alert.'
          : 'You help a user rewrite an ordinary neighbourhood resource request.',
      'Return only the requested JSON fields.',
      'Do not assess emergency severity, medical urgency, danger, or whether volunteers will respond.',
      'Do not invent facts, addresses, contact details, quantities, or timing.',
      'Use calm Canadian English and preserve the user’s meaning.',
      'The summary must be suitable for a public neighbourhood board.',
      'The safety note should remind the user not to publish exact addresses or personal contact details.',
      '',
      `User draft: ${parsedRequest.data.draft}`,
    ].join('\n')

    let response: Response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 1_024,
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  title: { type: 'STRING' },
                  category: {
                    type: 'STRING',
                    enum: [
                      'power_charging',
                      'supplies',
                      'mobility_accessibility',
                      'transportation',
                      'wellness_checkin',
                      'other',
                    ],
                  },
                  summary: { type: 'STRING' },
                  suggestedTags: {
                    type: 'ARRAY',
                    items: { type: 'STRING' },
                    maxItems: 4,
                  },
                  safetyNote: { type: 'STRING' },
                },
                required: ['title', 'category', 'summary', 'suggestedTags', 'safetyNote'],
              },
            },
          }),
          signal: AbortSignal.timeout(12_000),
        },
      )
    } catch {
      return c.json(
        {
          error: 'Gemini is temporarily unavailable. Continue with the manual form.',
          code: 'upstream_unavailable',
        },
        502,
      )
    }

    if (!response.ok) {
      console.warn(`[gemini] request failed status=${response.status} user=${auth.userId}`)
      return c.json(
        {
          error: 'Gemini could not improve this draft. Continue with the manual form.',
          code: 'upstream_error',
        },
        502,
      )
    }

    const payload = (await response.json()) as GeminiResponse
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return c.json(
        { error: 'Gemini returned no suggestion. Continue with the manual form.', code: 'empty' },
        502,
      )
    }

    let candidate: unknown
    try {
      candidate = JSON.parse(text)
    } catch {
      return c.json(
        { error: 'Gemini returned an invalid suggestion. Continue with the manual form.', code: 'invalid_output' },
        502,
      )
    }

    const clarity = claritySchema.safeParse(candidate)
    if (!clarity.success) {
      return c.json(
        { error: 'Gemini returned an invalid suggestion. Continue with the manual form.', code: 'invalid_output' },
        502,
      )
    }

    return c.json({ suggestion: clarity.data })
  })
}
