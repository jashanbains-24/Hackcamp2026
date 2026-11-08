import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Radio, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import {
  EmptyPanel,
  ErrorPanel,
  LoadingSkeleton,
  PageIntro,
  Pane,
  StatusLabel,
} from '@/components/neighbourgrid'
import { HelpItemCard } from '@/features/help/HelpItemCard'
import { useHelpNetwork } from '@/features/help/help-network'
import { demoActors } from '@/features/help/help-store'
import type { HelpKind } from '@/shared/types'

type Filter = 'all' | HelpKind

export default function HelpBoardPage() {
  const help = useHelpNetwork()
  const [filter, setFilter] = useState<Filter>('all')
  const visibleItems = useMemo(
    () =>
      [...help.items]
        .filter((item) => filter === 'all' || item.kind === filter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filter, help.items],
  )

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8" data-help-source={help.source}>
      <PageIntro
        title="Help"
        action={
          <Link
            to="/app/help/new"
            viewTransition
            className="ng-press inline-flex min-h-11 items-center gap-1.5 rounded-[14px] bg-primary pl-3.5 pr-4 text-sm font-semibold text-primary-foreground shadow-none transition-[transform,background-color] duration-150 hover:bg-primary-ink"
          >
            <Plus className="size-4" aria-hidden /> New
          </Link>
        }
      />

      {help.source === 'demo' ? (
        <Pane className="ng-pane-in ng-row min-h-13 justify-between py-1.5 pr-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <StatusLabel tone="demo">DEMO</StatusLabel>
            <span className="truncate text-sm text-muted-foreground" aria-hidden>
              Viewing as
            </span>
          </div>
          <div className="flex items-center gap-1">
            <select
              id="demo-help-user"
              aria-label="View help board as"
              value={help.activeUserId}
              onChange={(event) => help.setActiveUser(event.target.value)}
              className="ng-field min-h-10 w-auto bg-transparent pr-2 text-sm font-semibold"
            >
              {demoActors.map((actor) => (
                <option key={actor.id} value={actor.id}>{actor.displayName}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Reset help demo"
              title="Reset help demo"
              onClick={help.resetDemo}
            >
              <RotateCcw aria-hidden />
            </Button>
          </div>
        </Pane>
      ) : null}

      <div className="ng-segment mt-4 max-w-full overflow-x-auto" role="group" aria-label="Filter help board">
        {([
          ['all', 'All'],
          ['request', 'Needs'],
          ['offer', 'Offers'],
          ['beacon', 'Beacons'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className="ng-press shrink-0"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {help.status === 'loading' ? (
          <div className="space-y-3" aria-label="Loading help board">
            <LoadingSkeleton className="h-28" />
            <LoadingSkeleton className="h-28" />
          </div>
        ) : help.status === 'error' ? (
          <ErrorPanel
            title="Help board unavailable"
            description={help.error || 'Try again once the connection recovers.'}
          />
        ) : visibleItems.length > 0 ? (
          <div className="ng-stagger space-y-3">
            {visibleItems.map((item) => (
              <HelpItemCard
                key={item.id}
                item={item}
                responses={help.responses}
                activeUserId={help.activeUserId}
                communityName={help.session.homeCommunity.name}
                actorName={help.actorName}
                onRespond={help.respond}
                onAccept={help.acceptResponse}
                onResolve={help.resolve}
                onCancel={help.cancel}
              />
            ))}
          </div>
        ) : (
          <EmptyPanel
            icon={Radio}
            title="Nothing here yet"
            description="Try another filter or post something."
            action={
              <Link
                to="/app/help/new"
                className="inline-flex min-h-11 items-center rounded-[14px] bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                New help item
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}
