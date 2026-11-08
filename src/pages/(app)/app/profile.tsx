import { useState } from 'react'
import { AuthOverlay, signOut } from 'deepspace'
import { ChevronDown } from 'lucide-react'
import { Footnote, PageIntro, Pane, StatusLabel } from '@/components/neighbourgrid'
import { Button } from '@/components/ui'
import { useNeighbourGridSession } from '@/neighbourgrid/session'

export default function ProfilePage() {
  const session = useNeighbourGridSession()
  const [showAuth, setShowAuth] = useState(false)
  const [saving, setSaving] = useState(false)
  const initial = session.displayName.slice(0, 1).toUpperCase() || 'N'
  const statusLine =
    session.mode === 'authenticated'
      ? 'Signed in with DeepSpace'
      : session.isDemo
        ? 'Demo account · fictional data'
        : 'Signed out'

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-8">
      <PageIntro
        title="Profile"
        action={session.isDemo ? <StatusLabel tone="demo">DEMO</StatusLabel> : undefined}
      />

      <Pane strong className="ng-pane-in flex items-center gap-4 p-4 sm:p-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/12 text-xl font-semibold text-primary-ink">
          {initial}
        </span>
        <div className="min-w-0">
          <h2 className="ng-type-title-sm truncate text-foreground">{session.displayName}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{statusLine}</p>
        </div>
      </Pane>

      <Pane className="ng-pane-in ng-pane-in-delay-1 ng-row-divide mt-4 overflow-hidden">
        <label htmlFor="home-community" className="ng-row min-h-14 cursor-pointer justify-between py-2">
          <span className="min-w-0">
            <span className="block text-sm text-muted-foreground">Home community</span>
            <span className="block truncate text-base font-semibold text-foreground">
              {session.homeCommunity.name}, {session.homeCommunity.municipality}
            </span>
          </span>
          <span className="relative shrink-0">
            <select
              id="home-community"
              className="peer absolute inset-0 size-full cursor-pointer opacity-0"
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
            <span
              className="inline-flex min-h-10 items-center gap-1 rounded-full bg-foreground/6 pl-3.5 pr-2.5 text-sm font-semibold text-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50"
              aria-hidden
            >
              Change
              <ChevronDown className="size-4 text-muted-foreground" />
            </span>
          </span>
        </label>
        <div className="ng-row min-h-14 justify-between py-2">
          <span>
            <span className="block text-sm text-muted-foreground">Location</span>
            <span className="block text-base font-semibold text-foreground">Approximate area only</span>
          </span>
        </div>
      </Pane>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {session.mode === 'authenticated' ? (
          <Button variant="secondary" size="lg" onClick={() => void signOut()}>
            Sign out
          </Button>
        ) : (
          <Button size="lg" onClick={() => setShowAuth(true)}>Sign in with DeepSpace</Button>
        )}

        {session.isDemo ? (
          <Button
            variant="secondary"
            size="lg"
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
            size="lg"
            onClick={() => {
              session.enterDemoMode()
              window.location.assign('/app?demo=1')
            }}
          >
            Enter demo mode
          </Button>
        )}
      </div>

      <Footnote className="mt-5">Not an emergency service · Emergency? Call 911.</Footnote>

      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} providers={['google', 'github']} />}
    </div>
  )
}
