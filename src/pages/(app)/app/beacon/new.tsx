import { useId, useState, type FormEvent } from 'react'
import { ArrowLeft, Radio, ShieldAlert, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Textarea, useToast } from '@/components/ui'
import { BackLink, Pane, StatusLabel } from '@/components/neighbourgrid'
import { useHelpNetwork } from '@/features/help/help-network'
import { helpCategoryLabels } from '@/features/help/help-store'
import { clarifyHelpRequest } from '@/features/help/request-clarity'
import type { HelpCategory } from '@/shared/types'

type BeaconReach = 'nearby' | 'city' | 'region'

/* Glass check: 20px, 6px radius, themed from the glass border and the teal accent. */
const beaconCheckbox =
  'size-5 rounded-[6px] border-foreground/30 bg-card data-[checked]:shadow-none disabled:opacity-70'

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
  const [reach, setReach] = useState<BeaconReach>('nearby')
  const [roughDraft, setRoughDraft] = useState('')
  const [clarifying, setClarifying] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const sendToId = useId()
  const cooldown = help.beaconCooldown
  const remainingMinutes = Math.max(1, Math.ceil(cooldown.remainingMs / 60_000))
  const home = help.session.homeCommunity
  const adjacentCommunities = help.session.communitiesCatalog
    .filter((community) => home.adjacentCommunityIds.includes(community.id))
    .slice(0, 2)
  const widerCommunities = help.session.communitiesCatalog.filter((community) => community.id !== home.id)
  const cityCommunities = widerCommunities.filter(
    (community) => community.municipality === home.municipality,
  )
  const extraTargets =
    reach === 'city'
      ? cityCommunities.map((community) => community.id)
      : reach === 'region'
        ? widerCommunities.map((community) => community.id)
        : targetCommunityIds
  const audience =
    reach === 'city'
      ? `All of ${home.municipality}`
      : reach === 'region'
        ? 'All communities'
        : [home.name, ...adjacentCommunities
            .filter((community) => targetCommunityIds.includes(community.id))
            .map((community) => community.name)]
            .join(' + ')

  async function improveDraft() {
    if (roughDraft.trim().length < 12) {
      warning('Add a rough draft', 'Write at least one sentence for Gemini to improve.')
      return
    }
    setClarifying(true)
    try {
      const next = await clarifyHelpRequest(roughDraft.trim(), 'beacon')
      setCategory(next.category)
      setDescription(next.summary.trim().slice(0, 300))
      success('Added to your post')
    } catch (cause) {
      error(
        'Assistant unavailable',
        cause instanceof Error
          ? cause.message
          : 'Continue with the manual form; nothing you typed was lost.',
      )
    } finally {
      setClarifying(false)
    }
  }

  function chooseReach(next: Exclude<BeaconReach, 'nearby'>) {
    setReach((current) => (current === next ? 'nearby' : next))
  }

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
        targetCommunityIds: extraTargets,
        reach,
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

      <Pane
        className="ng-attend ng-pane-in mt-5 flex gap-3 p-4"
        role="note"
      >
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-beacon-ink" aria-hidden />
        <p className="text-sm font-medium leading-6 text-foreground">
          Community volunteers may not respond. For immediate danger, call 911. This is not an
          emergency service.
        </p>
      </Pane>

      {!confirming ? (
        <>
        <section className="mt-6 px-1" aria-labelledby="clarity-title">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="clarity-title" className="text-base font-semibold text-foreground">
              Let AI help you write your post
            </h2>
            <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary-ink">
              Gemini
            </span>
          </div>
          <label htmlFor="rough-beacon-draft" className="sr-only">
            Rough idea for your post
          </label>
          <Textarea
            id="rough-beacon-draft"
            className="mt-3"
            value={roughDraft}
            onChange={(event) => setRoughDraft(event.target.value)}
            maxLength={1000}
            rows={2}
            placeholder="Jot a rough idea"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            loading={clarifying}
            onClick={improveDraft}
          >
            <Sparkles aria-hidden />
            Help me write
          </Button>
        </section>

        <form className="mt-6" onSubmit={review}>
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
                    {home.name}
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
                const included = reach !== 'nearby'
                const checked = included || targetCommunityIds.includes(community.id)
                return (
                  <div key={community.id} className="ng-row min-h-13">
                    <Checkbox
                      checked={checked}
                      disabled={included}
                      onCheckedChange={toggle}
                      aria-labelledby={labelId}
                      className={beaconCheckbox}
                    />
                    {/* The text is the tap target for the whole row; the checkbox carries the a11y. */}
                    <span
                      id={labelId}
                      className="min-w-0 flex-1 cursor-pointer select-none"
                      onClick={() => {
                        if (!included) toggle(!checked)
                      }}
                    >
                      <span className="block text-base font-semibold text-foreground">{community.name}</span>
                      <span className="block text-sm text-muted-foreground">Nearby</span>
                    </span>
                  </div>
                )
              })}
            </Pane>
            <Pane className="ng-pane-in ng-pane-in-delay-3 ng-row-divide mt-2 overflow-hidden">
              {([
                ['city', 'City-wide', home.municipality],
                ['region', 'Regional', 'All communities'],
              ] as const).map(([value, label, detail]) => {
                const labelId = `${sendToId}-${value}`
                const checked = reach === value
                return (
                  <div key={value} className="ng-row min-h-13">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => chooseReach(value)}
                      aria-labelledby={labelId}
                      className={beaconCheckbox}
                    />
                    <span
                      id={labelId}
                      className="min-w-0 flex-1 cursor-pointer select-none"
                      onClick={() => chooseReach(value)}
                    >
                      <span className="block text-base font-semibold text-foreground">{label}</span>
                      <span className="block text-sm text-muted-foreground">{detail}</span>
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
        </>
      ) : (
        <Pane strong className="ng-pane-in mt-4 p-5" aria-labelledby="confirm-beacon-title">
          <h2 id="confirm-beacon-title" className="inline-flex items-center gap-2 text-sm font-semibold text-beacon-ink">
            <Radio className="size-4" aria-hidden />
            Final confirmation
          </h2>
          <p className="ng-type-title mt-2 text-foreground">{categoryTitles[category]}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
          <dl className="mt-4 grid gap-1.5 pt-1 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-semibold text-foreground">{helpCategoryLabels[category]}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Communities</dt>
              <dd className="text-right font-semibold text-foreground">{audience}</dd>
            </div>
          </dl>
          {reach !== 'nearby' && (
            <p className="mt-4 text-sm font-medium leading-6 text-beacon-ink">
              {reach === 'city'
                ? `This reaches every community in ${home.municipality}, not only ${home.name}.`
                : 'This reaches every community, including other cities.'}
            </p>
          )}
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
        </Pane>
      )}
    </div>
  )
}
