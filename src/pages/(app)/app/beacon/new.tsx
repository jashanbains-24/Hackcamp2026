import { useState, type FormEvent } from 'react'
import { ArrowLeft, Radio, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Textarea, useToast } from '@/components/ui'
import { BackLink, StatusLabel } from '@/components/neighbourgrid'
import { useHelpNetwork } from '@/features/help/help-network'
import { helpCategoryLabels } from '@/features/help/help-store'
import type { HelpCategory } from '@/shared/types'

const categoryTitles: Record<HelpCategory, string> = {
  power_charging: 'Power or charging help needed',
  supplies: 'Essential supplies needed',
  mobility_accessibility: 'Mobility assistance requested',
  transportation: 'Transportation help requested',
  wellness_checkin: 'Neighbour check-in requested',
  other: 'Community assistance requested',
}

export default function BeaconPage() {
  const navigate = useNavigate()
  const help = useHelpNetwork()
  const { success, warning, error } = useToast()
  const [category, setCategory] = useState<HelpCategory>('power_charging')
  const [description, setDescription] = useState('')
  const [targetCommunityIds, setTargetCommunityIds] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const cooldown = help.beaconCooldown
  const remainingMinutes = Math.max(1, Math.ceil(cooldown.remainingMs / 60_000))
  const adjacentCommunities = help.session.communitiesCatalog
    .filter((community) =>
      help.session.homeCommunity.adjacentCommunityIds.includes(community.id),
    )
    .slice(0, 2)

  function review(event: FormEvent) {
    event.preventDefault()
    const cleanDescription = description.trim()
    if (cleanDescription.length < 12) {
      warning('Add a short explanation', 'Tell neighbours what practical help would be useful.')
      return
    }
    if (/(?:\+?\d[\d\s().-]{7,}\d)|@/.test(cleanDescription)) {
      warning('Remove private details', 'Do not put contact information in a public beacon.')
      return
    }
    if (!cooldown.available) {
      warning('Beacon cooldown active', `Try again in about ${remainingMinutes} minutes.`)
      return
    }
    setConfirming(true)
  }

  async function sendBeacon() {
    if (!help.beaconCooldown.available) {
      warning('Beacon cooldown active', 'This beacon was not sent again.')
      return
    }
    setSending(true)
    try {
      const beaconId = await help.createBeacon({
        title: categoryTitles[category],
        description,
        category,
        communityId: help.session.homeCommunityId,
        targetCommunityIds,
      })
      if (!beaconId) {
        warning('Beacon cooldown active', 'This beacon was not sent again.')
        setConfirming(false)
        return
      }
      success(
        help.source === 'live' ? 'Beacon sent to the community' : 'Demo beacon sent to the community',
        'It is now visible on the help board.',
      )
      navigate('/app/help')
    } catch (cause) {
      error(
        'Could not send beacon',
        cause instanceof Error ? cause.message : 'Try again after the connection recovers.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to="/app">
        <ArrowLeft className="size-4" aria-hidden /> Home
      </BackLink>

      <div className="mt-4 border-t border-border pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusLabel tone="help">{help.source === 'live' ? 'LIVE' : 'DEMO'}</StatusLabel>
          <StatusLabel tone="warning">High visibility</StatusLabel>
        </div>
        <h1 className="ng-type-display mt-3 text-foreground">Community Help Beacon</h1>
        <p className="ng-type-body mt-3 max-w-[46ch] text-muted-foreground">
          Ask opted-in neighbours for timely practical help in {help.session.homeCommunity.name}
          {' '}and an eligible nearby community.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div
            className="ng-attend flex gap-3 rounded-xl border border-beacon/30 bg-beacon/8 p-4"
            role="note"
          >
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-beacon" aria-hidden />
            <p className="text-sm font-medium leading-6 text-foreground">
              Community volunteers may not respond. For immediate danger, call 911. This is not an
              emergency service.
            </p>
          </div>
        </div>

        {!confirming ? (
          <form className="mt-7 space-y-5" onSubmit={review}>
            <div>
              <label htmlFor="beacon-category" className="text-sm font-semibold text-foreground">
                What kind of help?
              </label>
              <select
                id="beacon-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as HelpCategory)}
                className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                {Object.entries(helpCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="beacon-description" className="text-sm font-semibold text-foreground">
                Short explanation
              </label>
              <Textarea
                id="beacon-description"
                className="mt-2"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={300}
                rows={4}
                placeholder="For example: looking to charge a phone for an hour this evening."
                required
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {description.length}/300
              </p>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-foreground">Target communities</legend>
              <div className="mt-2 space-y-2">
                <label className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-card px-3">
                  <input type="checkbox" checked disabled className="size-4 accent-primary" />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {help.session.homeCommunity.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">Home community</span>
                  </span>
                </label>
                {adjacentCommunities.map((community) => (
                  <label
                    key={community.id}
                    className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3"
                  >
                    <input
                      type="checkbox"
                      checked={targetCommunityIds.includes(community.id)}
                      onChange={(event) =>
                        setTargetCommunityIds((current) =>
                          event.target.checked
                            ? [...current, community.id].slice(0, 2)
                            : current.filter((id) => id !== community.id),
                        )
                      }
                      className="size-4 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {community.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Eligible adjacent community
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {!cooldown.available && (
              <p className="rounded-lg bg-advisory px-3 py-2.5 text-sm text-advisory-foreground">
                A demo beacon was recently created. Try again in about {remainingMinutes} minutes.
              </p>
            )}

            <Button
              type="submit"
              disabled={!cooldown.available}
              className="h-12 w-full bg-beacon text-beacon-foreground hover:bg-beacon/90"
            >
              Review beacon
            </Button>
          </form>
        ) : (
          <section className="mt-7 rounded-xl border border-beacon/35 bg-beacon/5 p-5" aria-labelledby="confirm-beacon-title">
            <div className="flex items-center gap-2 text-beacon">
              <Radio className="size-5" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-wide">Final confirmation</p>
            </div>
            <h2 id="confirm-beacon-title" className="ng-type-title mt-3 text-foreground">
              {categoryTitles[category]}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-semibold text-foreground">{helpCategoryLabels[category]}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Communities</dt>
                <dd className="text-right font-semibold text-foreground">
                  {[help.session.homeCommunity.name, ...adjacentCommunities
                    .filter((community) => targetCommunityIds.includes(community.id))
                    .map((community) => community.name)]
                    .join(' + ')}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm font-medium leading-6 text-foreground">
              Community volunteers may not respond. For immediate danger, call 911. This is not an
              emergency service.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                className="h-12 flex-1 bg-beacon text-beacon-foreground hover:bg-beacon/90"
                onClick={sendBeacon}
                loading={sending}
              >
                Send to community
              </Button>
              <Button variant="outline" className="h-12" onClick={() => setConfirming(false)}>
                Go back
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {help.source === 'live'
                ? 'In-app only · No emergency service or external broadcaster is contacted.'
                : 'DEMO only · No external service or real user is contacted.'}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
