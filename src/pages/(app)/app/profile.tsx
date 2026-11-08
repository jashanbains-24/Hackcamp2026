import { useState } from 'react'
import { AuthOverlay, signOut } from 'deepspace'
import { PageIntro, StatusLabel } from '@/components/neighbourgrid'
import { Button } from '@/components/ui'
import { useNeighbourGridSession } from '@/neighbourgrid/session'

export default function ProfilePage() {
  const session = useNeighbourGridSession()
  const [showAuth, setShowAuth] = useState(false)
  const [saving, setSaving] = useState(false)
  const initial = session.displayName.slice(0, 1).toUpperCase() || 'N'

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-7">
      <PageIntro
        title="Profile"
        description="Approximate home community and account controls. Precise location is never collected."
        action={session.isDemo ? <StatusLabel tone="demo">DEMO account</StatusLabel> : undefined}
      />

      <div className="border-t border-border pt-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-lg font-semibold text-foreground">
            {initial}
          </span>
          <div>
            <h2 className="ng-type-title-sm text-foreground">{session.displayName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.mode === 'authenticated'
                ? 'Signed in with DeepSpace'
                : session.isDemo
                  ? 'Fenced demo user — fictional data only'
                  : 'Signed out'}
            </p>
          </div>
        </div>

        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="ng-type-meta text-muted-foreground">Home community</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {session.homeCommunity.name}, {session.homeCommunity.municipality}
            </dd>
          </div>
          <div>
            <dt className="ng-type-meta text-muted-foreground">Privacy</dt>
            <dd className="mt-1 font-semibold text-foreground">Approximate area only</dd>
          </div>
        </dl>

        <div className="mt-8 space-y-3">
          <label className="block text-sm font-medium text-foreground" htmlFor="home-community">
            Change home community
          </label>
          <select
            id="home-community"
            className="min-h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            value={session.homeCommunityId}
            disabled={saving}
            onChange={(event) => {
              const next = event.target.value
              setSaving(true)
              void session.setHomeCommunityId(next).finally(() => setSaving(false))
            }}
          >
            {session.communitiesCatalog.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}, {community.municipality}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {session.mode === 'authenticated' ? (
            <Button
              variant="secondary"
              onClick={() => {
                void signOut()
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button onClick={() => setShowAuth(true)}>Sign in with DeepSpace</Button>
          )}

          {session.isDemo ? (
            <Button
              variant="secondary"
              onClick={() => {
                session.leaveDemoMode()
                window.location.assign('/app')
              }}
            >
              Leave demo mode
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                session.enterDemoMode()
                window.location.assign('/app?demo=1')
              }}
            >
              Enter demo mode
            </Button>
          )}
        </div>

        <p className="ng-type-meta mt-6 leading-5 text-muted-foreground">
          Demo mode uses fictional Newton content and never grants production privileges. For
          immediate danger, call 911. NeighbourGrid is not an emergency service.
        </p>
      </div>

      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} providers={['google', 'github']} />}
    </div>
  )
}
