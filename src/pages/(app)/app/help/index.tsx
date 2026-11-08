import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Radio, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import { EmptyPanel, PageIntro, StatusLabel } from '@/components/neighbourgrid'
import { HelpItemCard } from '@/features/help/HelpItemCard'
import {
  demoActors,
  helpDemoActions,
  useHelpDemoStore,
} from '@/features/help/help-store'
import type { HelpKind } from '@/shared/types'

type Filter = 'all' | HelpKind

export default function HelpBoardPage() {
  const state = useHelpDemoStore()
  const [filter, setFilter] = useState<Filter>('all')
  const visibleItems = useMemo(
    () =>
      [...state.items]
        .filter((item) => filter === 'all' || item.kind === filter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filter, state.items],
  )

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro
        title="Help board"
        description="Ask for practical support, offer what you can, and close the loop together."
        action={
          <Link
            to="/app/help/new"
            viewTransition
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden /> New
          </Link>
        }
      />

      <section className="mb-5 rounded-xl border border-border bg-card p-4" aria-labelledby="demo-role-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <StatusLabel tone="demo">DEMO</StatusLabel>
              <h2 id="demo-role-heading" className="text-sm font-semibold text-foreground">
                Participant view
              </h2>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Switch fictional residents to rehearse offer, accept, and resolve states.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="demo-help-user">View help board as</label>
            <select
              id="demo-help-user"
              value={state.activeUserId}
              onChange={(event) => helpDemoActions.setActiveUser(event.target.value)}
              className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground"
            >
              {demoActors.map((actor) => (
                <option key={actor.id} value={actor.id}>{actor.displayName}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Reset help demo"
              title="Reset help demo"
              onClick={() => helpDemoActions.reset()}
            >
              <RotateCcw aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      <div className="flex gap-1 overflow-x-auto border-b border-border pb-2" aria-label="Filter help board">
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
            className={
              filter === value
                ? 'min-h-11 shrink-0 rounded-lg bg-muted px-3 text-sm font-semibold text-foreground'
                : 'min-h-11 shrink-0 rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }
          >
            {label}
          </button>
        ))}
      </div>

      {visibleItems.length > 0 ? (
        <div>
          {visibleItems.map((item) => (
            <HelpItemCard
              key={item.id}
              item={item}
              responses={state.responses}
              activeUserId={state.activeUserId}
            />
          ))}
        </div>
      ) : (
        <EmptyPanel
          icon={Radio}
          title="Nothing in this view"
          description="Try another filter or create a new help item."
          action={
            <Link
              to="/app/help/new"
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Create help item
            </Link>
          }
        />
      )}
    </div>
  )
}
