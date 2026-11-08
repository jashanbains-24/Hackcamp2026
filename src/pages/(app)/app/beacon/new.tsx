import { useId, useState, type FormEvent } from 'react'
import { ArrowLeft, Radio, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Textarea, useToast } from '@/components/ui'
import { BackLink, Footnote, Pane, StatusLabel } from '@/components/neighbourgrid'
import { useHelpNetwork } from '@/features/help/help-network'
import { helpCategoryLabels } from '@/features/help/help-store'
import type { HelpCategory } from '@/shared/types'

/* Glass check: 20px, 6px radius, themed from the glass border and the teal accent. */
const beaconCheckbox =
  'size-5 rounded-[6px] border-glass-border bg-card/70 shadow-[inset_0_1px_0_0_var(--color-glass-highlight)] data-[checked]:shadow-none disabled:opacity-70'

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
  const sendToId = useId()
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
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-8">
      <BackLink to="/app">
        <ArrowLeft className="size-4" aria-hidden /> Home
      </BackLink>

      <div className="mt-3 flex flex-wrap items-center gap-2.5 px-1">
        <h1 className="ng-type-display text-foreground">Help Beacon</h1>
        <StatusLabel tone="help">{help.source === 'live' ? 'LIVE' : 'DEMO'}</StatusLabel>
      </div>
      <p className="ng-type-body mt-1.5 px-1 text-muted-foreground">
        A high-visibility ask to opted-in neighbours nearby.
      </p>

      <Pane
        className="ng-attend ng-pane-in mt-5 flex gap-3 border-beacon/30 p-4"
        role="note"
      >
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-beacon" aria-hidden />
        <p className="text-sm font-medium leading-6 text-foreground">
          Community volunteers may not respond. For immediate danger, call 911. This is not an
          emergency service.
        </p>
      </Pane>

      {!confirming ? (
        <form className="mt-4" onSubmit={review}>
          <Pane className="ng-pane-in ng-pane-in-delay-1 space-y-4 p-4 sm:p-5">
            <div>
              <label htmlFor="beacon-category" className="text-sm font-semibold text-foreground">
                What kind of help?
              </label>
              <select
                id="beacon-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as HelpCategory)}
                className="ng-field mt-1.5"
              >
                {Object.entries(helpCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="beacon-description" className="text-sm font-semibold text-foreground">
                  Short explanation
                </label>
                <span className="text-xs text-muted-foreground">{description.length}/300</span>
              </div>
              <Textarea
                id="beacon-description"
                className="mt-1.5"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={300}
                rows={3}
                placeholder="Need to charge a phone for an hour this evening."
                required
              />
            </div>
          </Pane>

          <fieldset className="mt-4">
            <legend className="mb-2 px-2 text-sm font-semibold text-foreground">Send to</legend>
            <Pane className="ng-pane-in ng-pane-in-delay-2 ng-row-divide overflow-hidden">
              <div className="ng-row min-h-13">
                <Checkbox
                  checked
                  disabled
                  aria-labelledby={`${sendToId}-home`}
                  className={beaconCheckbox}
                />
                <span id={`${sendToId}-home`} className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-foreground">
                    {help.session.homeCommunity.name}
                  </span>
                  <span className="block text-sm text-muted-foreground">Home</span>
                </span>
              </div>
              {adjacentCommunities.map((community) => {
                const labelId = `${sendToId}-${community.id}`
                const toggle = (checked: boolean) =>
                  setTargetCommunityIds((current) =>
                    checked
                      ? [...current, community.id].slice(0, 2)
                      : current.filter((id) => id !== community.id),
                  )
                const checked = targetCommunityIds.includes(community.id)
                return (
                  <div key={community.id} className="ng-row min-h-13">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={toggle}
                      aria-labelledby={labelId}
                      className={beaconCheckbox}
                    />
                    {/* The text is the tap target for the whole row; the checkbox carries the a11y. */}
                    <span
                      id={labelId}
                      className="min-w-0 flex-1 cursor-pointer select-none"
                      onClick={() => toggle(!checked)}
                    >
                      <span className="block text-base font-semibold text-foreground">{community.name}</span>
                      <span className="block text-sm text-muted-foreground">Nearby</span>
                    </span>
                  </div>
                )
              })}
            </Pane>
          </fieldset>

          {!cooldown.available && (
            <p className="mt-4 rounded-[14px] bg-advisory px-3.5 py-2.5 text-sm text-advisory-foreground">
              Recent beacon sent. Try again in about {remainingMinutes} min.
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={!cooldown.available}
            className="mt-4 w-full bg-beacon text-beacon-foreground hover:bg-beacon/90"
          >
            Review beacon
          </Button>
        </form>
      ) : (
        <Pane strong className="ng-pane-in mt-4 border-beacon/30 p-5" aria-labelledby="confirm-beacon-title">
          <h2 id="confirm-beacon-title" className="inline-flex items-center gap-2 text-sm font-semibold text-beacon">
            <Radio className="size-4" aria-hidden />
            Final confirmation
          </h2>
          <p className="ng-type-title mt-2 text-foreground">{categoryTitles[category]}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
          <dl className="mt-4 grid gap-1.5 border-t border-border pt-3 text-sm">
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
          <p className="mt-4 text-sm font-medium leading-6 text-foreground">
            Community volunteers may not respond. For immediate danger, call 911. This is not an
            emergency service.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              className="flex-1 bg-beacon text-beacon-foreground hover:bg-beacon/90"
              onClick={sendBeacon}
              loading={sending}
            >
              Send to community
            </Button>
            <Button variant="outline" size="lg" onClick={() => setConfirming(false)}>
              Go back
            </Button>
          </div>
          <Footnote className="mt-3">
            {help.source === 'live' ? 'In-app only · contacts no one outside' : 'DEMO · contacts no one'}
          </Footnote>
        </Pane>
      )}
    </div>
  )
}
