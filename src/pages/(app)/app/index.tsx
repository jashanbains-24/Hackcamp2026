import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, MapPin } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import {
  demoOfficialState,
  demoPosts,
  demoUser,
  homeCommunity,
  postAuthors,
  resourceLinks,
} from '@/shared/demo-data'

export default function AppHomePage() {
  const [showDemoInfo, setShowDemoInfo] = useState(false)

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <header className="border-b border-border pb-5">
        <h1 className="ng-type-display text-foreground">
          Good evening, {demoUser.displayName}
        </h1>
        <button
          type="button"
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          onClick={() => setShowDemoInfo(true)}
        >
          <MapPin className="size-4 text-primary" aria-hidden />
          {homeCommunity.name}, {homeCommunity.municipality}
          <ChevronRight className="size-4" aria-hidden />
        </button>
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
            href={demoOfficialState.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary-ink hover:underline"
          >
            {demoOfficialState.sourceName}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
        <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">
          {demoOfficialState.title}
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          {demoOfficialState.description}
        </p>
        <p
          className="mt-4 rounded-lg bg-advisory px-3 py-2.5 text-sm leading-6 text-advisory-foreground"
          aria-label="Simulated scenario notice"
        >
          <span className="font-semibold">DEMO</span>
          {' · '}
          Sample posts below are fictional, not live warnings.
        </p>
      </section>

      <section className="border-b border-border py-6" aria-labelledby="community-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="community-heading" className="ng-type-title-sm text-foreground">
            From your neighbours
          </h2>
          <Link
            to="/app/communities/newton"
            viewTransition
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary-ink hover:underline"
          >
            View all
          </Link>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {demoPosts.map((post) => (
            <li key={post.id}>
              <Link
                to="/app/communities/newton"
                viewTransition
                className="block py-3.5 transition hover:bg-muted/40 focus-visible:outline-none sm:-mx-2 sm:rounded-lg sm:px-2"
              >
                <p className="ng-type-meta text-muted-foreground">
                  {post.kind === 'resource_offer' ? 'Resource offer' : 'Discussion'}
                  {' · '}
                  {postAuthors[post.authorId]}
                </p>
                <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">
                  {post.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
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

      <Modal open={showDemoInfo} onClose={() => setShowDemoInfo(false)} size="sm">
        <Modal.Header>
          <Modal.Title>Newton is your demo home</Modal.Title>
          <Modal.Description>
            Community switching arrives in the next build. This preview never requests your precise
            location.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={() => setShowDemoInfo(false)}>Got it</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
