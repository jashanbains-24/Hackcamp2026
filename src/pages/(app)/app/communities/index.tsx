import { useMemo, useState } from 'react'
import { ChevronRight, Search, Users, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro, Pane, StatusLabel } from '@/components/neighbourgrid'
import { CommunityMembership } from '@/components/communities/CommunityMembership'
import { communityCatalog } from '@/services/communities'
import { useNeighbourGridSession } from '@/neighbourgrid/exports'
import { communityCityOrder, demoMemberCounts } from '@/shared/demo-data'
import type { Community } from '@/shared/types'

function byName(a: Community, b: Community) {
  return a.name.localeCompare(b.name)
}

export default function CommunitiesPage() {
  const session = useNeighbourGridSession()
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const groups = useMemo(() => {
    const matched = communityCatalog.filter((community) => {
      if (!normalized) return true
      return (
        community.name.toLowerCase().includes(normalized) ||
        community.municipality.toLowerCase().includes(normalized)
      )
    })
    const cities = [...new Set(matched.map((community) => community.municipality))]
    cities.sort((a, b) => {
      const aRank = communityCityOrder.indexOf(a)
      const bRank = communityCityOrder.indexOf(b)
      const aOrder = aRank === -1 ? communityCityOrder.length : aRank
      const bOrder = bRank === -1 ? communityCityOrder.length : bRank
      if (aOrder !== bOrder) return aOrder - bOrder
      return a.localeCompare(b)
    })
    return cities.map((city) => {
      const rows = matched.filter((community) => community.municipality === city)
      return {
        city,
        open: rows.filter((community) => community.visibility === 'public').sort(byName),
        request: rows.filter((community) => community.visibility === 'request_to_join').sort(byName),
      }
    })
  }, [normalized])

  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-8">
      <PageIntro title="Communities" />
      <div className="relative mb-6">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          aria-label="Search communities"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 w-full rounded-full border border-foreground/10 bg-foreground/8 pr-12 pl-11 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            className="ng-press absolute top-1 right-1 grid size-10 place-items-center rounded-full text-muted-foreground"
            onClick={() => setQuery('')}
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <p className="px-1 text-sm text-muted-foreground">No matches</p>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.city} aria-label={group.city}>
            <h2 className="mb-2 px-2 text-sm font-medium text-muted-foreground">{group.city}</h2>
            <div className="space-y-2">
              {group.open.length > 0 && (
                <Pane className="ng-pane-in ng-row-divide overflow-hidden">
                  {group.open.map((community) => (
                    <CommunityRow
                      key={community.id}
                      community={community}
                      isHome={session.homeCommunityId === community.id}
                    />
                  ))}
                </Pane>
              )}
              {group.request.length > 0 && (
                <Pane className="ng-pane-in ng-row-divide overflow-hidden">
                  {group.request.map((community) => (
                    <CommunityRow
                      key={community.id}
                      community={community}
                      isHome={session.homeCommunityId === community.id}
                    />
                  ))}
                </Pane>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function CommunityRow({ community, isHome }: { community: Community; isHome: boolean }) {
  const members = demoMemberCounts[community.id]
  return (
    <div className="ng-row min-h-16 flex-wrap gap-y-2 py-3 sm:flex-nowrap">
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
          {members != null && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="size-3.5" aria-hidden />
              <span className="sr-only">{members} members</span>
              <span aria-hidden>{members}</span>
            </span>
          )}
        </span>
        {isHome && <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
      </Link>
      <div className="shrink-0">
        <CommunityMembership communityId={community.id} isHome={isHome} compact />
      </div>
    </div>
  )
}
