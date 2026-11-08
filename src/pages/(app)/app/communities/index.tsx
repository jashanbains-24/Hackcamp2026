import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro, StatusLabel } from '@/components/neighbourgrid'
import { CommunityMembership } from '@/components/communities/CommunityMembership'
import { communityCatalog } from '@/services/communities'
import { useNeighbourGridSession } from '@/neighbourgrid/exports'

export default function CommunitiesPage() {
  const session = useNeighbourGridSession()

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro
        title="Communities"
        description="Find your local space, join the conversation, and choose a home community."
      />
      <p className="mb-5 text-sm text-muted-foreground">
        Curated BC communities use approximate neighbourhood boundaries. They are not precise GIS areas.
      </p>
      <ul className="divide-y divide-border border-t border-border">
        {communityCatalog.map((community) => (
          <li key={community.id} className="py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/app/communities/${community.slug}`}
                    viewTransition
                    className="ng-type-title-sm rounded text-foreground hover:text-primary-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {community.name}
                  </Link>
                  {session.homeCommunityId === community.id && <StatusLabel tone="success">Home</StatusLabel>}
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  {community.municipality}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{community.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {community.visibility === 'public' ? 'Open to join' : 'Request to join'}
                </p>
              </div>
              <CommunityMembership communityId={community.id} isHome={session.homeCommunityId === community.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
