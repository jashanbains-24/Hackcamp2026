import { Link } from 'react-router-dom'
import { LockKeyhole, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui'
import { Card, SectionHeader } from '@/components/neighbourgrid'
import { communities } from '@/shared/demo-data'

export default function CommunitiesPage() {
  return (
    <div className="mx-auto max-w-[920px] px-4 py-8 sm:px-6">
      <SectionHeader eyebrow="Discover" title="Your nearby communities" />
      <p className="-mt-2 mb-6 max-w-2xl leading-6 text-muted-foreground">
        Browse the fictional Phase 0 preview. Joining, approvals, and home-community switching
        arrive in the communities workstream.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {communities.map((community) => (
          <Link key={community.id} to={`/app/communities/${community.slug}`}>
            <Card className="h-full p-5 transition hover:border-primary/35">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                  <MapPin className="size-5" aria-hidden />
                </span>
                {community.slug === 'newton' ? (
                  <Badge className="bg-primary/10 text-primary">Home community</Badge>
                ) : community.visibility === 'request_to_join' ? (
                  <Badge variant="outline" className="gap-1"><LockKeyhole className="size-3" /> Request to join</Badge>
                ) : (
                  <Badge variant="outline">Public</Badge>
                )}
              </div>
              <h2 className="mt-5 text-xl font-bold">{community.name}</h2>
              <p className="mt-1 text-sm font-medium text-primary">{community.municipality}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{community.description}</p>
              <p className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Users className="size-3.5" aria-hidden />
                Demo community
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
