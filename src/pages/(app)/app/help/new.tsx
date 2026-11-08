import { useState, type FormEvent } from 'react'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Textarea, useToast } from '@/components/ui'
import { BackLink } from '@/components/neighbourgrid'
import {
  helpCategoryLabels,
  helpDemoActions,
} from '@/features/help/help-store'
import {
  clarifyHelpRequest,
  type RequestClaritySuggestion,
} from '@/features/help/request-clarity'
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
  const [suggestion, setSuggestion] = useState<RequestClaritySuggestion | null>(null)

  async function improveDraft() {
    if (roughDraft.trim().length < 12) {
      warning('Add a rough draft', 'Write at least one sentence for Gemini to improve.')
      return
    }
    setClarifying(true)
    try {
      const next = await clarifyHelpRequest(roughDraft.trim())
      setSuggestion(next)
      setTitle(next.title)
      setDescription(next.summary)
      setCategory(next.category)
      success('Suggestion ready', 'Review and edit every field before posting.')
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

  function submit(event: FormEvent) {
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

    helpDemoActions.createHelp({
      kind,
      title: cleanTitle,
      description: cleanDescription,
      category,
      communityId: 'community-newton',
    })
    success(kind === 'request' ? 'Request posted' : 'Offer posted', 'The demo help board updated.')
    navigate('/app/help')
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to="/app/help">
        <ArrowLeft className="size-4" aria-hidden /> Help board
      </BackLink>

      <div className="mt-4 border-t border-border pt-6">
        <h1 className="ng-type-display text-foreground">
          {kind === 'request' ? 'Ask for help' : 'Offer help'}
        </h1>
        <p className="ng-type-body mt-3 max-w-[48ch] text-muted-foreground">
          Share only what neighbours need to understand the practical request. Exact handoff
          details stay private.
        </p>

        {kind === 'request' && (
          <section className="mt-7 rounded-xl border border-primary/25 bg-secondary/60 p-4 sm:p-5" aria-labelledby="clarity-title">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" aria-hidden />
              <h2 id="clarity-title" className="text-sm font-semibold text-foreground">
                Request Clarity Assistant
              </h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Gemini can suggest clearer, safer wording. It never publishes, broadcasts, or
              decides emergency severity.
            </p>
            <label htmlFor="rough-help-draft" className="sr-only">Rough request draft</label>
            <Textarea
              id="rough-help-draft"
              className="mt-3 bg-card"
              value={roughDraft}
              onChange={(event) => setRoughDraft(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="My block is out and I need somewhere to charge my phone for an hour."
            />
            <Button
              type="button"
              variant="outline"
              className="mt-3 bg-card"
              loading={clarifying}
              onClick={improveDraft}
            >
              <Sparkles aria-hidden />
              Improve my draft
            </Button>
            {suggestion && (
              <div className="mt-4 border-t border-primary/20 pt-3">
                <p className="text-xs font-semibold text-foreground">Suggested tags</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {suggestion.suggestedTags.map((tag) => `#${tag}`).join(' ')}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {suggestion.safetyNote}
                </p>
              </div>
            )}
          </section>
        )}

        <form className="mt-7 space-y-5" onSubmit={submit}>
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">What are you posting?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {([
                ['request', 'I need help'],
                ['offer', 'I can offer'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={kind === value}
                  onClick={() => setKind(value)}
                  className={
                    kind === value
                      ? 'min-h-12 rounded-lg border border-primary bg-secondary px-3 text-sm font-semibold text-foreground'
                      : 'min-h-12 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="help-category" className="text-sm font-semibold text-foreground">
              Category
            </label>
            <select
              id="help-category"
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
            <label htmlFor="help-title" className="text-sm font-semibold text-foreground">
              Title
            </label>
            <Input
              id="help-title"
              className="mt-2 h-11"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              required
              placeholder={
                kind === 'request'
                  ? 'Looking to borrow a portable charger'
                  : 'Two battery lanterns available'
              }
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{title.length}/80</p>
          </div>

          <div>
            <label htmlFor="help-description" className="text-sm font-semibold text-foreground">
              Description
            </label>
            <Textarea
              id="help-description"
              className="mt-2"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={5}
              required
              placeholder="Describe what would help, when you need it, and a safe public handoff area if useful."
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          <div className="flex gap-3 rounded-xl border border-border bg-muted/45 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-6 text-muted-foreground">
              Avoid exact addresses, phone numbers, email addresses, and sensitive medical
              information. Prefer a safe public handoff where appropriate.
            </p>
          </div>

          <Button type="submit" className="h-12 w-full">
            {kind === 'request' ? 'Post request' : 'Post offer'}
          </Button>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            DEMO · Saved in this browser and synchronized across open local tabs.
          </p>
        </form>
      </div>
    </div>
  )
}
