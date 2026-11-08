import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import {
  EmptyPanel,
  ErrorPanel,
  LoadingSkeleton,
  PageIntro,
  Pane,
  StatusLabel,
  placeholderIcons,
} from '@/components/neighbourgrid'
import { formatTimestamp } from '@/neighbourgrid/format'
import { useHomeAggregates } from '@/neighbourgrid/home-data'
import { useNeighbourGridSession } from '@/neighbourgrid/session'

function shortWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return formatTimestamp(value)
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date)
}

export default function ActivityPage() {
  const session = useNeighbourGridSession()
  const aggregates = useHomeAggregates(session)
  const ready = aggregates.status === 'ready' || aggregates.status === 'demo'

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8">
      <PageIntro
        title="Activity"
        description={session.homeCommunity.name}
        action={session.isDemo ? <StatusLabel tone="demo">DEMO</StatusLabel> : undefined}
      />

      {aggregates.status === 'loading' && (
        <div className="space-y-2">
          <LoadingSkeleton className="h-14" />
          <LoadingSkeleton className="h-14" />
          <LoadingSkeleton className="h-14" />
        </div>
      )}

      {aggregates.status === 'error' && (
        <ErrorPanel title="Activity could not load" description={aggregates.error ?? 'Try refreshing.'} />
      )}

      {ready && aggregates.activity.length === 0 && (
        <EmptyPanel
          icon={placeholderIcons.activity}
          title="Nothing yet"
          description="Posts and help from your community will appear here."
          action={
            <Link
              to="/app"
              viewTransition
              className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-ink"
            >
              Home
            </Link>
          }
        />
      )}

      {ready && aggregates.activity.length > 0 && (
        <Pane className="ng-pane-in ng-row-divide overflow-hidden">
          {aggregates.activity.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              viewTransition
              className="ng-row min-h-14 py-3 transition hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-base font-semibold text-foreground">{item.title}</span>
                  {/* Only the required DEMO label; the kind already leads the detail line. */}
                  {item.tone === 'demo' && <StatusLabel tone="demo">DEMO</StatusLabel>}
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  {item.detail} · {shortWhen(item.at)}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </Pane>
      )}
    </div>
  )
}
