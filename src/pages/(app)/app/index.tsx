import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, MapPin } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import {
  ErrorPanel,
  Footnote,
  LoadingSkeleton,
  Pane,
  StatusLabel,
} from '@/components/neighbourgrid'
import { resourceLinks } from '@/shared/demo-data'
import { useHomeAggregates } from '@/neighbourgrid/home-data'
import { useOfficialUpdates } from '@/neighbourgrid/official-updates'
import { formatTimestamp, timeOfDayGreeting } from '@/neighbourgrid/format'
import { useNeighbourGridSession } from '@/neighbourgrid/session'
import { NeighbourhoodGuide } from '@/features/assistant/NeighbourhoodGuide'

function shortTime(value: string | null) {
  if (!value) return formatTimestamp(value)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return formatTimestamp(value)
  return new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' }).format(date)
}

/** BC Hydro titles repeat the status ("Current Outage - ..."); the label already carries it. */
function displayTitle(title: string) {
  return title.replace(/^\s*(current|restored|planned)\s+outage\s*[-–—:]\s*/i, '').trim() || title
}

export default function AppHomePage() {
  const session = useNeighbourGridSession()
  const aggregates = useHomeAggregates(session)
  const official = useOfficialUpdates()
  const [showHomePicker, setShowHomePicker] = useState(false)
  const [savingHome, setSavingHome] = useState(false)

  const greeting = `${timeOfDayGreeting()}, ${session.displayName}`
  const ready = aggregates.status === 'ready' || aggregates.status === 'demo'

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8">
      <header className="px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="ng-type-display text-foreground">{greeting}</h1>
          {session.isDemo && <StatusLabel tone="demo">DEMO</StatusLabel>}
        </div>
        <button
          type="button"
          className="ng-press ng-glass-pill mt-3 inline-flex min-h-10 items-center gap-1.5 pl-3 pr-2 text-sm font-semibold text-foreground"
          onClick={() => setShowHomePicker(true)}
        >
          <MapPin className="size-4 text-primary" aria-hidden />
          {session.homeCommunity.name}, {session.homeCommunity.municipality}
          <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
        </button>
      </header>

      <Pane strong className="ng-pane-in mt-6 p-4 sm:p-5" aria-labelledby="help-heading">
        <h2 id="help-heading" className="ng-type-title text-foreground">
          Need something nearby?
        </h2>
        <Link
          to="/app/help/new"
          viewTransition
          className="ng-press mt-4 inline-flex min-h-13 w-full items-center justify-center rounded-[14px] bg-primary px-5 text-base font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28)] transition-[transform,background-color] duration-150 hover:bg-primary-ink"
        >
          Ask for help
        </Link>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            to="/app/help"
            viewTransition
            className="ng-press inline-flex min-h-11 items-center justify-center rounded-[14px] bg-foreground/6 text-sm font-semibold text-foreground transition-[transform,background-color] duration-150 hover:bg-foreground/10"
          >
            Help board
          </Link>
          <Link
            to="/app/beacon/new"
            viewTransition
            className="ng-press inline-flex min-h-11 items-center justify-center rounded-[14px] bg-beacon/12 text-sm font-semibold text-beacon transition-[transform,background-color] duration-150 hover:bg-beacon/18"
          >
            Help Beacon
          </Link>
        </div>
      </Pane>

      <NeighbourhoodGuide session={session} aggregates={aggregates} />

      <section className="mt-6" aria-labelledby="official-heading">
        <div className="mb-2.5 flex items-baseline justify-between gap-3 px-2">
          <h2 id="official-heading" className="ng-type-title-sm text-foreground">
            Official updates
          </h2>
          <a
            href={official.data?.sourceUrl ?? 'https://www.bchydro.com/safety-outages/power-outages.html'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary-ink hover:underline"
          >
            {official.data?.sourceName ?? 'BC Hydro'}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>

        {official.status === 'loading' && (
          <div className="space-y-2">
            <LoadingSkeleton className="h-14" />
            <LoadingSkeleton className="h-14" />
          </div>
        )}

        {official.status === 'unavailable' && (
          <ErrorPanel
            title="Feed unavailable in this preview"
            description="Open the DeepSpace runtime or the deployed URL for live BC Hydro Surrey updates."
            action={
              <Button variant="secondary" onClick={official.refresh}>
                Try again
              </Button>
            }
          />
        )}

        {official.status === 'error' && official.data && (
          <ErrorPanel
            title="Could not refresh BC Hydro"
            description={official.data.errorMessage ?? `Last attempt ${formatTimestamp(official.data.fetchedAt)}.`}
            action={
              <Button variant="secondary" onClick={official.refresh}>
                Retry
              </Button>
            }
          />
        )}

        {official.status === 'empty' && official.data && (
          <Pane className="ng-pane-in ng-pane-in-delay-1 p-4">
            <p className="text-base font-semibold text-foreground">No current Surrey outages</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetched {shortTime(official.data.fetchedAt)} · BC Hydro Surrey feed
            </p>
          </Pane>
        )}

        {official.status === 'ok' && official.data && (
          <Pane className="ng-pane-in ng-pane-in-delay-1 ng-row-divide overflow-hidden">
            {official.data.updates.slice(0, 3).map((update) => (
              <details key={update.id} className="ng-disclosure">
                <summary className="ng-row min-h-14 py-3 outline-none focus-visible:bg-foreground/5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-semibold text-foreground">
                      {displayTitle(update.title)}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                      <StatusLabel tone="official">
                        {update.status === 'current'
                          ? 'Current'
                          : update.status === 'restored'
                            ? 'Restored'
                            : 'Official'}
                      </StatusLabel>
                      {update.municipality ?? 'Surrey'} · {shortTime(update.publishedAt)}
                    </span>
                  </span>
                  <ChevronRight className="ng-disclosure-chevron size-4 shrink-0 text-muted-foreground" aria-hidden />
                </summary>
                <div className="px-4 pb-4 pt-0.5">
                  <p className="text-sm leading-6 text-muted-foreground">{update.description}</p>
                  <p className="ng-type-meta mt-2 text-muted-foreground">
                    Event {formatTimestamp(update.publishedAt)} · Fetched {formatTimestamp(update.fetchedAt)}
                  </p>
                </div>
              </details>
            ))}
          </Pane>
        )}

      </section>

      <section className="mt-6" aria-labelledby="community-heading">
        <div className="mb-2.5 flex items-baseline justify-between gap-3 px-2">
          <h2 id="community-heading" className="ng-type-title-sm text-foreground">
            From your neighbours
          </h2>
          <Link
            to={`/app/communities/${session.homeCommunity.slug}`}
            viewTransition
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-ink hover:underline"
          >
            View all
          </Link>
        </div>

        {aggregates.status === 'loading' && (
          <div className="space-y-2">
            <LoadingSkeleton className="h-14" />
            <LoadingSkeleton className="h-14" />
          </div>
        )}

        {aggregates.status === 'error' && (
          <ErrorPanel title="Could not load activity" description={aggregates.error ?? 'Try again shortly.'} />
        )}

        {(aggregates.status === 'ready' || aggregates.status === 'demo') &&
          aggregates.latestPosts.length === 0 && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              No posts in {session.homeCommunity.name} yet.{' '}
              <Link
                to={`/app/communities/${session.homeCommunity.slug}`}
                viewTransition
                className="font-medium text-primary-ink hover:underline"
              >
                Start a conversation
              </Link>{' '}
              in your community.
            </p>
          )}

        {ready && aggregates.latestPosts.length > 0 && (
          <Pane className="ng-pane-in ng-pane-in-delay-2 ng-row-divide overflow-hidden">
            {aggregates.latestPosts.map((post) => (
              <Link
                key={post.id}
                to={`/app/communities/${post.communitySlug}`}
                viewTransition
                className="ng-row min-h-14 py-3 transition hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-semibold text-foreground">{post.title}</span>
                  <span className="block text-sm text-muted-foreground">
                    {post.kindLabel} · {post.authorLabel}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            ))}
          </Pane>
        )}
      </section>

      <section className="mt-6" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="ng-type-title-sm mb-2.5 px-2 text-foreground">
          Official resources
        </h2>
        <Pane className="ng-pane-in ng-pane-in-delay-3 ng-row-divide overflow-hidden">
          {resourceLinks.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="ng-row min-h-14 py-3 transition hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-semibold text-foreground">{resource.title}</span>
                <span className="block text-sm text-muted-foreground">{resource.source}</span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </a>
          ))}
        </Pane>
      </section>

      <Footnote
        className="mt-6"
        aria-label="Simulated scenario notice"
        data-testid="demo-scenario-notice"
      >
        {session.isDemo && (
          <>
            <span className="font-semibold text-foreground">DEMO</span> · Neighbour posts are fictional.{' '}
          </>
        )}
        Official updates are Surrey-wide from BC Hydro, not verified for{' '}
        {session.homeCommunity.name}. Help is opt-in · Emergency? Call 911.
      </Footnote>

      <Modal open={showHomePicker} onClose={() => setShowHomePicker(false)} size="sm">
        <Modal.Header>
          <Modal.Title>Home community</Modal.Title>
          <Modal.Description>Approximate neighbourhood only.</Modal.Description>
        </Modal.Header>
        <div className="ng-row-divide overflow-hidden rounded-[16px] border border-border">
          {session.communitiesCatalog.map((community) => {
            const selected = community.id === session.homeCommunityId
            return (
              <button
                key={community.id}
                type="button"
                disabled={savingHome}
                className="ng-row min-h-12 w-full justify-between text-left text-sm font-medium text-foreground transition hover:bg-foreground/5 disabled:opacity-60"
                onClick={() => {
                  setSavingHome(true)
                  void session.setHomeCommunityId(community.id).finally(() => {
                    setSavingHome(false)
                    setShowHomePicker(false)
                  })
                }}
              >
                <span>
                  {community.name}, {community.municipality}
                </span>
                {selected && <StatusLabel tone="official">Home</StatusLabel>}
              </button>
            )
          })}
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHomePicker(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
