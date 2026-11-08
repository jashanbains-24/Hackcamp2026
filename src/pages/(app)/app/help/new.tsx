import { useState, type FormEvent } from 'react'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Textarea, useToast } from '@/components/ui'
import { BackLink, Pane } from '@/components/neighbourgrid'
import { useHelpNetwork } from '@/features/help/help-network'
import { helpCategoryLabels } from '@/features/help/help-store'
import { clarifyHelpRequest } from '@/features/help/request-clarity'
import type { HelpCategory } from '@/shared/types'

const contactPattern =
  /(?:\+?\d[\d\s().-]{7,}\d)|(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i

export default function NewHelpPage() {
  const navigate = useNavigate()
  const { success, warning, error } = useToast()
  const [kind, setKind] = useState<'request' | 'offer'>('request')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<HelpCategory>('power_charging')
  const [roughDraft, setRoughDraft] = useState('')
  const [clarifying, setClarifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const help = useHelpNetwork()

  async function improveDraft() {
    if (roughDraft.trim().length < 12) {
      warning('Add a rough draft', 'Write at least one sentence for Gemini to improve.')
      return
    }
    setClarifying(true)
    try {
      const next = await clarifyHelpRequest(roughDraft.trim(), kind)
      setTitle(next.title)
      setDescription(next.summary)
      setCategory(next.category)
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

  async function submit(event: FormEvent) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()

    if (cleanTitle.length < 5 || cleanDescription.length < 12) {
      warning('Add a little more detail', 'Use a clear title and a short practical description.')
      return
    }
    if (contactPattern.test(`${cleanTitle} ${cleanDescription}`)) {
      warning(
        'Remove public contact details',
        'Do not include phone numbers or email addresses. Arrange private details after matching.',
      )
      return
    }

    setSubmitting(true)
    try {
      await help.createHelp({
        kind,
        title: cleanTitle,
        description: cleanDescription,
        category,
        communityId: help.session.homeCommunityId,
      })
      success(
        kind === 'request' ? 'Request posted' : 'Offer posted',
        help.source === 'live'
          ? 'The live help board updated.'
          : 'The demo help board updated.',
      )
      navigate('/app/help')
    } catch (cause) {
      error(
        'Could not post help item',
        cause instanceof Error ? cause.message : 'Try again after the connection recovers.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-8">
      <BackLink to="/app/help">
        <ArrowLeft className="size-4" aria-hidden /> Help
      </BackLink>

      <h1 className="ng-type-display mt-3 px-1 text-foreground">
        {kind === 'request' ? 'Ask for help' : 'Offer help'}
      </h1>

      <div className="ng-segment mt-4 grid w-full grid-cols-2" role="group" aria-label="What are you posting?">
        {([
          ['request', 'I need help'],
          ['offer', 'I can offer'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={kind === value}
            onClick={() => setKind(value)}
            className="ng-press"
          >
            {label}
          </button>
        ))}
      </div>

      <section className="mt-6 px-1" aria-labelledby="clarity-title">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="clarity-title" className="text-base font-semibold text-foreground">
            Let AI help you write your post
          </h2>
          <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary-ink">
            Gemini
          </span>
        </div>
        <label htmlFor="rough-help-draft" className="sr-only">
          Rough idea for your post
        </label>
        <Textarea
          id="rough-help-draft"
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

      <form className="mt-6" onSubmit={submit}>
        <h2 className="mb-2 px-1 text-base font-semibold text-foreground">Your post</h2>
        <Pane className="ng-pane-in ng-pane-in-delay-1 space-y-4 p-4 sm:p-5">
          <div>
            <label htmlFor="help-category" className="text-sm font-semibold text-foreground">
              Category
            </label>
            <select
              id="help-category"
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
            <label htmlFor="help-title" className="text-sm font-semibold text-foreground">
              Title
            </label>
            <Input
              id="help-title"
              className="mt-1.5 h-11"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              required
              placeholder={
                kind === 'request' ? 'Borrow a portable charger' : 'Two battery lanterns to lend'
              }
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="help-description" className="text-sm font-semibold text-foreground">
                Description
              </label>
              <span className="text-xs text-muted-foreground">{description.length}/500</span>
            </div>
            <Textarea
              id="help-description"
              className="mt-1.5"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={4}
              required
              placeholder="What would help, when, and a public place to meet."
            />
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              No addresses, phone numbers, or medical details.
            </p>
          </div>
        </Pane>

        <Button type="submit" size="lg" className="mt-4 w-full" loading={submitting}>
          {kind === 'request' ? 'Post request' : 'Post offer'}
        </Button>
      </form>
    </div>
  )
}
