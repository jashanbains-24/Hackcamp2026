import { Link } from 'react-router-dom'
import { PageIntro } from '@/components/neighbourgrid'
import { communities } from '@/shared/demo-data'

export default function CommunitiesPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro
        title="Communities"
        description="Browse nearby groups. Joining and home switching come next."
      />
      <ul className="divide-y divide-border border-t border-border">
        {communities.map((community) => (
          <li key={community.id}>
            <Link
              to={`/app/communities/${community.slug}`}
              viewTransition
              className="block py-4 transition hover:bg-muted/40 focus-visible:outline-none sm:-mx-2 sm:rounded-lg sm:px-2"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="ng-type-title-sm text-foreground">{community.name}</h2>
                <span className="ng-type-meta text-muted-foreground">
                  {community.slug === 'newton'
                    ? 'Home'
                    : community.visibility === 'request_to_join'
                      ? 'Request to join'
                      : 'Open'}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {community.municipality}
                {' · '}
                {community.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
