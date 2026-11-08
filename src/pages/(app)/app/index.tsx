import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, MapPin } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import { ErrorPanel, LoadingSkeleton, StatusLabel } from '@/components/neighbourgrid'
import { resourceLinks } from '@/shared/demo-data'
import { useHomeAggregates } from '@/neighbourgrid/home-data'
import { useOfficialUpdates } from '@/neighbourgrid/official-updates'
import { formatTimestamp, timeOfDayGreeting } from '@/neighbourgrid/format'
import { useNeighbourGridSession } from '@/neighbourgrid/session'

export default function AppHomePage() {
  const session = useNeighbourGridSession()
  const aggregates = useHomeAggregates(session)
  const official = useOfficialUpdates()
  const [showHomePicker, setShowHomePicker] = useState(false)
  const [savingHome, setSavingHome] = useState(false)

  const greeting = `${timeOfDayGreeting()}, ${session.displayName}`

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <header className="border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="ng-type-display text-foreground">{greeting}</h1>
          {session.isDemo && <StatusLabel tone="demo">DEMO account</StatusLabel>}
        </div>
        <button
          type="button"
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          onClick={() => setShowHomePicker(true)}
        >
          <MapPin className="size-4 text-primary" aria-hidden />
          {session.homeCommunity.name}, {session.homeCommunity.municipality}
          <ChevronRight className="size-4" aria-hidden />
        </button>
        {(aggregates.status === 'ready' || aggregates.status === 'demo') && (
          <p className="ng-type-meta mt-3 text-muted-foreground">
            {aggregates.postCount} recent post{aggregates.postCount === 1 ? '' : 's'}
            {' · '}
            {aggregates.openHelpCount} open help item
            {aggregates.openHelpCount === 1 ? '' : 's'}
            {aggregates.source === 'demo' ? ' · demo data' : ''}
          </p>
        )}
      </header>

      <section className="border-b border-border py-7" aria-labelledby="help-heading">
        <h2 id="help-heading" className="ng-type-title text-foreground">
          Need something nearby?
        </h2>
        <div className="ng-settle mt-4 flex flex-col gap-3">
          <Link
            to="/app/help/new"
            viewTransition
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98]"
          >
            Ask for help
          </Link>
          <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
            <Link
              to="/app/help"
              viewTransition
              className="min-h-11 inline-flex items-center text-primary-ink hover:underline"
            >
              Help board
            </Link>
            <Link
              to="/app/beacon/new"
              viewTransition
              className="min-h-11 inline-flex items-center text-beacon hover:underline"
            >
              Community Help Beacon
            </Link>
          </p>
        </div>
        <p className="ng-type-meta mt-3 leading-5 text-muted-foreground">
          Opt-in help only. Immediate danger? Call 911.
        </p>
      </section>

      <section className="border-b border-border py-6" aria-labelledby="official-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 id="official-heading" className="ng-type-title-sm text-foreground">
            Official updates
          </h2>
          <a
            href={official.data?.sourceUrl ?? 'https://www.bchydro.com/safety-outages/power-outages.html'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary-ink hover:underline"
          >
            {official.data?.sourceName ?? 'BC Hydro'}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>

        {official.status === 'loading' && (
          <div className="mt-3 space-y-3">
            <LoadingSkeleton className="h-16" />
            <LoadingSkeleton className="h-12" />
          </div>
        )}

        {official.status === 'unavailable' && (
          <div className="mt-3">
            <ErrorPanel
              title="Official feed unavailable here"
              description="This preview cannot reach the Worker endpoint. Open the DeepSpace runtime or a deployed URL for live BC Hydro Surrey updates, or use the source link."
              action={
                <Button variant="secondary" onClick={official.refresh}>
                  Try again
                </Button>
              }
            />
          </div>
        )}

        {official.status === 'error' && official.data && (
          <div className="mt-3">
            <ErrorPanel
              title="Could not refresh BC Hydro updates"
              description={
                official.data.errorMessage ??
                'The Surrey municipality feed did not load. NeighbourGrid will keep source links available.'
              }
              action={
                <Button variant="secondary" onClick={official.refresh}>
                  Retry
                </Button>
              }
            />
            <p className="ng-type-meta mt-3 text-muted-foreground">
              Last attempt {formatTimestamp(official.data.fetchedAt)}
            </p>
          </div>
        )}

        {official.status === 'empty' && official.data && (
          <div className="mt-3">
            <h3 className="text-base font-semibold leading-snug text-foreground">
              No current Surrey outage items in the feed
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              BC Hydro’s Surrey municipality RSS had no items when fetched. That is not a claim about
              Newton specifically.
            </p>
            <p className="ng-type-meta mt-3 text-muted-foreground">
              Fetched {formatTimestamp(official.data.fetchedAt)} · Source BC Hydro Surrey feed
            </p>
          </div>
        )}

        {official.status === 'ok' && official.data && (
          <div className="mt-3">
            <ul className="divide-y divide-border">
              {official.data.updates.slice(0, 3).map((update) => (
                <li key={update.id} className="py-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusLabel tone="official">
                      {update.status === 'current'
                        ? 'Current'
                        : update.status === 'restored'
                          ? 'Restored'
                          : 'Official'}
                    </StatusLabel>
                    <span className="ng-type-meta text-muted-foreground">
                      {update.municipality ?? 'Surrey'} municipality
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground">
                    {update.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {update.description.slice(0, 220)}
                    {update.description.length > 220 ? '…' : ''}
                  </p>
                  <p className="ng-type-meta mt-2 text-muted-foreground">
                    Event {formatTimestamp(update.publishedAt)} · Fetched{' '}
                    {formatTimestamp(update.fetchedAt)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="ng-type-meta mt-3 text-muted-foreground">
              {official.data.municipalityNote}
            </p>
          </div>
        )}

        <p
          className="mt-4 rounded-lg bg-advisory px-3 py-2.5 text-sm leading-6 text-advisory-foreground"
          aria-label="Simulated scenario notice"
          data-testid="demo-scenario-notice"
        >
          <span className="font-semibold">DEMO</span>
          {' · '}
          Sample neighbour posts below are fictional, not live warnings.
        </p>
      </section>

      <section className="border-b border-border py-6" aria-labelledby="community-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="community-heading" className="ng-type-title-sm text-foreground">
            From your neighbours
          </h2>
          <Link
            to={`/app/communities/${session.homeCommunity.slug}`}
            viewTransition
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary-ink hover:underline"
          >
            View all
          </Link>
        </div>

        {aggregates.status === 'loading' && (
          <div className="mt-3 space-y-3">
            <LoadingSkeleton className="h-14" />
            <LoadingSkeleton className="h-14" />
          </div>
        )}

        {aggregates.status === 'error' && (
          <div className="mt-3">
            <ErrorPanel
              title="Could not load community activity"
              description={aggregates.error ?? 'Please try again in a moment.'}
            />
          </div>
        )}

        {(aggregates.status === 'ready' || aggregates.status === 'demo') &&
          aggregates.latestPosts.length === 0 && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              No posts in {session.homeCommunity.name} yet. Community posting lands in Developer B’s
              lane.
            </p>
          )}

        {(aggregates.status === 'ready' || aggregates.status === 'demo') &&
          aggregates.latestPosts.length > 0 && (
            <ul className="mt-2 divide-y divide-border">
              {aggregates.latestPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/app/communities/${post.communitySlug}`}
                    viewTransition
                    className="block py-3.5 transition hover:bg-muted/40 focus-visible:outline-none sm:-mx-2 sm:rounded-lg sm:px-2"
                  >
                    <p className="ng-type-meta text-muted-foreground">
                      {post.kindLabel}
                      {' · '}
                      {post.authorLabel}
                    </p>
                    <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">
                      {post.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </section>

      <section className="py-6" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="ng-type-title-sm text-foreground">
          Official resources
        </h2>
        <ul className="mt-2 divide-y divide-border">
          {resourceLinks.map((resource) => (
            <li key={resource.title}>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center justify-between gap-4 py-3 transition hover:bg-muted/40 focus-visible:outline-none sm:-mx-2 sm:rounded-lg sm:px-2"
              >
                <span>
                  <span className="block font-semibold text-foreground">{resource.title}</span>
                  <span className="ng-type-meta mt-0.5 block text-muted-foreground">
                    {resource.source}
                  </span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Modal open={showHomePicker} onClose={() => setShowHomePicker(false)} size="sm">
        <Modal.Header>
          <Modal.Title>Choose home community</Modal.Title>
          <Modal.Description>
            Approximate neighbourhood only. NeighbourGrid never requests precise location.
          </Modal.Description>
        </Modal.Header>
        <div className="space-y-2 px-1 pb-2">
          {session.communitiesCatalog.map((community) => {
            const selected = community.id === session.homeCommunityId
            return (
              <button
                key={community.id}
                type="button"
                disabled={savingHome}
                className="flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-3 text-left text-sm font-medium transition hover:bg-muted/60 disabled:opacity-60"
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
                {selected && <StatusLabel tone="neutral">Home</StatusLabel>}
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
