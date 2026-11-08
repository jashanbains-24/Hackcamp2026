const HELP_REQUEST_EVENT = 'help_request_created'

export type HelpRequestEvent = {
  eventId: string
  eventType: typeof HELP_REQUEST_EVENT
  category: string
  communityName: string | null
  municipality: string | null
  createdAt: string
}

type N8nEnv = {
  N8N_WEBHOOK_URL?: string
  N8N_WEBHOOK_TOKEN?: string
}

export function buildHelpRequestEvent(input: {
  eventId: string
  category: string
  communityName?: string | null
  municipality?: string | null
  createdAt: string
}): HelpRequestEvent {
  return {
    eventId: input.eventId,
    eventType: HELP_REQUEST_EVENT,
    category: input.category,
    communityName: clipLabel(input.communityName),
    municipality: clipLabel(input.municipality),
    createdAt: input.createdAt,
  }
}

function clipLabel(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  return trimmed.slice(0, 120)
}

export async function notifyHelpRequestCreated(
  env: N8nEnv,
  event: HelpRequestEvent,
): Promise<void> {
  const webhookUrl = env.N8N_WEBHOOK_URL?.trim()
  const token = env.N8N_WEBHOOK_TOKEN?.trim()
  if (!webhookUrl || !token) return

  let url: URL
  try {
    url = new URL(webhookUrl)
  } catch {
    console.warn('[n8n] help event skipped because the webhook URL is invalid')
    return
  }
  if (url.protocol !== 'https:') {
    console.warn('[n8n] help event skipped because the webhook URL is not https')
    return
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-neighbourgrid-token': token,
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) {
      console.warn(`[n8n] help event failed status=${response.status}`)
    }
  } catch {
    console.warn('[n8n] help event unavailable')
  }
}
