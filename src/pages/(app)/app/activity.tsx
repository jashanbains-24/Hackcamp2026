import { Link } from 'react-router-dom'
import {
  EmptyPanel,
  ErrorPanel,
  LoadingSkeleton,
  PageIntro,
  StatusLabel,
  placeholderIcons,
} from '@/components/neighbourgrid'
import { formatTimestamp } from '@/neighbourgrid/format'
import { useHomeAggregates } from '@/neighbourgrid/home-data'
import { useNeighbourGridSession } from '@/neighbourgrid/session'

export default function ActivityPage() {
  const session = useNeighbourGridSession()
  const aggregates = useHomeAggregates(session)

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro
        title="Activity"
        description={
          session.isDemo
            ? 'Demo activity from fictional Newton posts and help items.'
            : `Recent posts and help activity for ${session.homeCommunity.name}.`
        }
        action={
          session.isDemo ? <StatusLabel tone="demo">DEMO</StatusLabel> : undefined
        }
      />

      {aggregates.status === 'loading' && (
        <div className="space-y-3 border-t border-border pt-5">
          <LoadingSkeleton className="h-16" />
          <LoadingSkeleton className="h-16" />
          <LoadingSkeleton className="h-16" />
        </div>
      )}

      {aggregates.status === 'error' && (
        <div className="border-t border-border pt-5">
          <ErrorPanel
            title="Activity could not load"
            description={aggregates.error ?? 'Please try again after refreshing.'}
          />
        </div>
      )}

      {(aggregates.status === 'ready' || aggregates.status === 'demo') &&
        aggregates.activity.length === 0 && (
          <div className="border-t border-border pt-5">
            <EmptyPanel
              icon={placeholderIcons.activity}
              title="No activity yet"
              description="When neighbours post or share help in your home community, it will show up here."
              action={
                <Link
                  to="/app"
                  viewTransition
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Back to home
                </Link>
              }
            />
          </div>
        )}

      {(aggregates.status === 'ready' || aggregates.status === 'demo') &&
        aggregates.activity.length > 0 && (
          <ul className="divide-y divide-border border-t border-border">
            {aggregates.activity.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  viewTransition
                  className="block py-4 transition hover:bg-muted/40 focus-visible:outline-none sm:-mx-2 sm:rounded-lg sm:px-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusLabel
                      tone={
                        item.tone === 'help' ? 'help' : item.tone === 'demo' ? 'demo' : 'neutral'
                      }
                    >
                      {item.tone === 'help' ? 'Help' : item.tone === 'demo' ? 'DEMO' : 'Community'}
                    </StatusLabel>
                    <span className="ng-type-meta text-muted-foreground">
                      {formatTimestamp(item.at)}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}
