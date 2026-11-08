import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/ui'
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
}

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
        searchWeb: false,
      })
      setTurns((current) => [
        ...current,
        {
          id: `assistant-${crypto.randomUUID()}`,
          role: 'assistant',
          content: result.answer,
          sources: result.sources,
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

  const canSend = draft.trim().length >= 2 && !asking

  return (
    <section className="mt-8" aria-labelledby="neighbourhood-guide-heading">
      <h2 id="neighbourhood-guide-heading" className="px-1 ng-type-title text-foreground">
        Neighbourhood Guide
      </h2>

      {session.mode !== 'authenticated' ? (
        <p className="mt-3 px-1 text-sm text-muted-foreground">
          <Link to="/app/profile" className="font-semibold text-foreground hover:underline">
            Sign in to ask the guide
          </Link>
        </p>
      ) : (
        <>
          {(turns.length > 0 || asking) && (
            <div
              className="mt-4 max-h-80 space-y-4 overflow-y-auto px-1"
              aria-live="polite"
              aria-label="Neighbourhood Guide conversation"
            >
              {turns.map((turn) => (
                <article
                  key={turn.id}
                  className={turn.role === 'user' ? 'ml-12 flex justify-end' : 'mr-8'}
                >
                  <div
                    className={
                      turn.role === 'user'
                        ? 'rounded-[20px] bg-primary px-4 py-2.5 text-primary-foreground'
                        : 'text-foreground'
                    }
                  >
                    <p className="whitespace-pre-wrap text-[15px] leading-6">{turn.content}</p>
                    {turn.role === 'assistant' && turn.sources && turn.sources.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {turn.sources.map((source) => (
                          <li key={source.url}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-2 hover:text-foreground"
                            >
                              {sourceLabel(source)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
              {asking && <p className="text-sm text-muted-foreground">…</p>}
            </div>
          )}

          <form className="relative mt-3" onSubmit={submitQuestion}>
            <label htmlFor="neighbourhood-guide-question" className="sr-only">
              Ask Neighbourhood Guide
            </label>
            <input
              id="neighbourhood-guide-question"
              value={draft}
              maxLength={1_000}
              placeholder="Ask anything"
              className="h-14 w-full rounded-full border border-foreground/10 bg-foreground/8 pl-5 pr-16 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
              onChange={(event) => setDraft(event.target.value)}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!canSend}
              className="ng-press absolute top-1.5 right-1.5 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="size-5" aria-hidden />
            </button>
          </form>
        </>
      )}
    </section>
  )
}
