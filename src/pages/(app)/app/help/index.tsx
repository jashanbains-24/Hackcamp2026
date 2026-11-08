import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageIntro } from '@/components/neighbourgrid'

export default function HelpBoardPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro
        title="Help board"
        description="Demo requests and offers. Matching comes next."
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
      <ul className="divide-y divide-border border-t border-border">
        <li className="py-4">
          <p className="ng-type-meta text-muted-foreground">Need · Open</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Portable charger for tonight
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Fictional Newton request. No address or contact details.
          </p>
        </li>
        <li className="py-4">
          <p className="ng-type-meta text-muted-foreground">Offer · Open</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Two battery lanterns to lend
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Handoff details stay private until an offer is accepted.
          </p>
        </li>
      </ul>
    </div>
  )
}
