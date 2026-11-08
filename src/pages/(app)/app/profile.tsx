import { PageIntro } from '@/components/neighbourgrid'
import { demoUser, homeCommunity } from '@/shared/demo-data'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro title="Profile" description="Account controls arrive in the platform workstream." />
      <div className="border-t border-border pt-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-lg font-semibold text-foreground">
            M
          </span>
          <div>
            <h2 className="ng-type-title-sm text-foreground">{demoUser.displayName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Demo account</p>
          </div>
        </div>
        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="ng-type-meta text-muted-foreground">Home community</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {homeCommunity.name}, {homeCommunity.municipality}
            </dd>
          </div>
          <div>
            <dt className="ng-type-meta text-muted-foreground">Privacy</dt>
            <dd className="mt-1 font-semibold text-foreground">Approximate area only</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
