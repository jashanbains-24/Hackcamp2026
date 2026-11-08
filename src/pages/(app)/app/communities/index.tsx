import { ChevronRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro, Pane, StatusLabel } from '@/components/neighbourgrid'
import { CommunityMembership } from '@/components/communities/CommunityMembership'
import { communityCatalog } from '@/services/communities'
import { useNeighbourGridSession } from '@/neighbourgrid/exports'
import { demoMemberCounts } from '@/shared/demo-data'

export default function CommunitiesPage() {
  const session = useNeighbourGridSession()

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8">
      <PageIntro title="Communities" />
      <Pane className="ng-pane-in ng-row-divide overflow-hidden">
        {communityCatalog.map((community) => {
          const isHome = session.homeCommunityId === community.id
          return (
            <div key={community.id} className="ng-row min-h-16 flex-wrap gap-y-2 py-3 sm:flex-nowrap">
              <Link
                to={`/app/communities/${community.slug}`}
                viewTransition
                className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-base font-semibold text-foreground group-hover:text-primary-ink">
                      {community.name}
                    </span>
                    {isHome && <StatusLabel tone="official">Home</StatusLabel>}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{community.municipality}</span>
                    {demoMemberCounts[community.id] != null && (
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5" aria-hidden />
                        <span className="sr-only">{demoMemberCounts[community.id]} members</span>
                        <span aria-hidden>{demoMemberCounts[community.id]}</span>
                      </span>
                    )}
                  </span>
                </span>
                {isHome && <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
              </Link>
              <div className="shrink-0">
                <CommunityMembership communityId={community.id} isHome={isHome} compact />
              </div>
            </div>
          )
        })}
      </Pane>
    </div>
  )
}
