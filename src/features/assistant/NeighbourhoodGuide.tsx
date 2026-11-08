import { useMemo, useState, type FormEvent } from 'react'
import { ExternalLink, Globe2, LockKeyhole, Send, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Textarea, useToast } from '@/components/ui'
import { Pane, StatusLabel } from '@/components/neighbourgrid'
import type { HomeAggregates } from '@/neighbourgrid/home-data'
import type { NeighbourGridSession } from '@/neighbourgrid/session'
import {
  askNeighbourhoodGuide,
  type GuideAppContext,
  type GuideSource,
  type GuideTurn,
} from './neighbourhood-guide'

type DisplayTurn = GuideTurn & {
  id: string
  sources?: GuideSource[]
  searchNote?: string | null
}

const starterQuestions = [
  'What is happening in my community?',
  'Are there current power outage updates?',
  'What help is currently available nearby?',
]

function sourceLabel(source: GuideSource): string {
  if (source.title.trim()) return source.title
  try {
    return new URL(source.url).hostname
  } catch {
    return 'Source'
  }
}

export function NeighbourhoodGuide({
  session,
  aggregates,
}: {
  session: NeighbourGridSession
  aggregates: HomeAggregates
}) {
  const { error: showError } = useToast()
  const [turns, setTurns] = useState<DisplayTurn[]>([])
  const [draft, setDraft] = useState('')
  const [searchWeb, setSearchWeb] = useState(false)
  const [asking, setAsking] = useState(false)

  const appContext = useMemo<GuideAppContext>(
    () => ({
      source: aggregates.source,
      homeCommunity: {
        name: session.homeCommunity.name,
        municipality: session.homeCommunity.municipality,
      },
      communities: session.communitiesCatalog.slice(0, 20).map((community) => ({
        name: community.name,
        municipality: community.municipality,
        visibility: community.visibility,
      })),
      recentPosts: aggregates.latestPosts.slice(0, 12).map((post) => ({
        title: post.title,
        kind: post.kindLabel,
        createdAt: post.createdAt,
      })),
      recentHelp: aggregates.latestHelp.slice(0, 12).map((item) => ({
        title: item.title,
        kind: item.kindLabel,
        status: item.statusLabel,
        createdAt: item.createdAt,
        demo: item.demo,
      })),
    }),
    [aggregates, session.communitiesCatalog, session.homeCommunity],
  )

  async function submitQuestion(event: FormEvent) {
    event.preventDefault()
    const message = draft.trim()
    if (message.length < 2 || asking) return

    const userTurn: DisplayTurn = {
      id: `user-${crypto.randomUUID()}`,
      role: 'user',
      content: message,
    }
    const history = turns.slice(-8).map(({ role, content }) => ({ role, content }))
    setTurns((current) => [...current, userTurn])
    setDraft('')
    setAsking(true)

    try {
      const result = await askNeighbourhoodGuide({
        message,
        history,
        appContext,
        searchWeb,
      })
      setTurns((current) => [
        ...current,
        {
          id: `assistant-${crypto.randomUUID()}`,
          role: 'assistant',
          content: result.answer,
          sources: result.sources,
          searchNote: result.searchNote,
        },
      ])
    } catch (caught) {
      const messageText =
        caught instanceof Error ? caught.message : 'Neighbourhood Guide could not answer.'
      showError('Guide unavailable', messageText)
    } finally {
      setAsking(false)
    }
  }

  return (
    <section className="mt-6" aria-labelledby="neighbourhood-guide-heading">
      <Pane strong className="ng-pane-in border-primary/15 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <h2 id="neighbourhood-guide-heading" className="ng-type-title text-foreground">
                Neighbourhood Guide
              </h2>
              <StatusLabel tone="official">Gemini</StatusLabel>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Ask about visible community activity, help requests, BC Hydro, or current web sources.
            </p>
          </div>
        </div>

        {session.mode !== 'authenticated' ? (
          <div className="mt-4 rounded-[16px] bg-foreground/5 p-4">
            <div className="flex gap-3">
              <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">Sign in to ask the guide</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Authentication protects the server-only API key and keeps community context scoped
                  to the signed-in user.
                </p>
                <Link
                  to="/app/profile"
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary-ink hover:underline"
                >
                  Open Profile to sign in
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {turns.length === 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {starterQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="ng-press min-h-11 rounded-full bg-foreground/6 px-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                    onClick={() => setDraft(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {turns.length > 0 && (
              <div
                className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1"
                aria-live="polite"
                aria-label="Neighbourhood Guide conversation"
              >
                {turns.map((turn) => (
                  <article
                    key={turn.id}
                    className={
                      turn.role === 'user'
                        ? 'ml-8 rounded-[16px] bg-primary px-4 py-3 text-primary-foreground'
                        : 'mr-4 rounded-[16px] bg-foreground/6 px-4 py-3 text-foreground'
                    }
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">{turn.content}</p>
                    {turn.searchNote && (
                      <p className="mt-2 text-xs leading-5 opacity-80">{turn.searchNote}</p>
                    )}
                    {turn.sources && turn.sources.length > 0 && (
                      <div className="mt-3 border-t border-current/10 pt-2">
                        <p className="text-xs font-semibold opacity-70">Sources</p>
                        <ul className="mt-1 space-y-1">
                          {turn.sources.map((source) => (
                            <li key={source.url}>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-primary-ink hover:underline"
                              >
                                {sourceLabel(source)}
                                <ExternalLink className="size-3" aria-hidden />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
                {asking && (
                  <div className="mr-4 rounded-[16px] bg-foreground/6 px-4 py-3 text-sm text-muted-foreground">
                    Checking your community context…
                  </div>
                )}
              </div>
            )}

            <form className="mt-4" onSubmit={submitQuestion}>
              <label htmlFor="neighbourhood-guide-question" className="sr-only">
                Ask Neighbourhood Guide
              </label>
              <Textarea
                id="neighbourhood-guide-question"
                value={draft}
                maxLength={1_000}
                rows={3}
                placeholder="What is happening nearby right now?"
                onChange={(event) => setDraft(event.target.value)}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={searchWeb}
                    className="size-4 accent-primary"
                    onChange={(event) => setSearchWeb(event.target.checked)}
                  />
                  <Globe2 className="size-4" aria-hidden />
                  Search the live web
                </label>
                <Button type="submit" loading={asking} disabled={draft.trim().length < 2}>
                  <Send aria-hidden />
                  Ask
                </Button>
              </div>
            </form>
          </>
        )}

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          AI can make mistakes. Check linked sources. Community content may be unverified; for
          immediate danger, call 911.
        </p>
      </Pane>
    </section>
  )
}
