import { useState, type FormEvent } from 'react'
import { Check, HandHeart, MapPin, Radio, RotateCcw, X } from 'lucide-react'
import { Button, Textarea, useToast } from '@/components/ui'
import { StatusLabel } from '@/components/neighbourgrid'
import type { HelpItem, HelpResponse } from '@/shared/types'
import {
  helpCategoryLabels,
} from './help-store'

const statusLabels = {
  open: 'Open',
  offered: 'Help offered',
  matched: 'Matched',
  resolved: 'Resolved',
  cancelled: 'Cancelled',
} as const

function formatCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function HelpItemCard({
  item,
  responses,
  activeUserId,
  communityName,
  actorName,
  onRespond,
  onAccept,
  onResolve,
  onCancel,
}: {
  item: HelpItem
  responses: HelpResponse[]
  activeUserId: string
  communityName: string
  actorName: (userId: string) => string
  onRespond: (helpItemId: string, note: string) => Promise<string | undefined>
  onAccept: (responseId: string) => Promise<boolean>
  onResolve: (itemId: string) => Promise<boolean>
  onCancel: (itemId: string) => Promise<boolean>
}) {
  const { success, warning, error } = useToast()
  const [showResponse, setShowResponse] = useState(false)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const isOwner = item.authorId === activeUserId
  const itemResponses = responses.filter((response) => response.helpItemId === item.id)
  const activeUserResponse = itemResponses.find(
    (response) => response.responderId === activeUserId,
  )
  const acceptedResponse = itemResponses.find((response) => response.acceptedByRequester)
  const canRespond =
    !isOwner &&
    ['request', 'beacon'].includes(item.kind) &&
    ['open', 'offered'].includes(item.status) &&
    !activeUserResponse

  async function runAction(action: () => Promise<boolean>, onSuccess: () => void) {
    setBusy(true)
    try {
      if (await action()) onSuccess()
    } catch (cause) {
      error('Could not update help item', cause instanceof Error ? cause.message : 'Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function submitResponse(event: FormEvent) {
    event.preventDefault()
    const trimmed = note.trim()
    if (trimmed.length < 3) {
      warning('Add a short note', 'Say what kind of help you can offer.')
      return
    }
    setBusy(true)
    try {
      const responseId = await onRespond(item.id, trimmed)
      if (!responseId) {
        warning('Could not send the offer', 'This request may no longer be available.')
        return
      }
      setNote('')
      setShowResponse(false)
      success('Offer shared', 'The requester can now review your note.')
    } catch (cause) {
      error('Could not send the offer', cause instanceof Error ? cause.message : 'Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article
      className={
        item.kind === 'beacon'
          ? 'ng-glass border-beacon/30 p-4 sm:p-5'
          : 'ng-glass p-4 sm:p-5'
      }
    >
      <h2 className="ng-type-title-sm text-foreground">{item.title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.description}</p>

      {/* Status chips lead the meta line: the title keeps the full width and nothing sits above it. */}
      <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-xs font-medium text-muted-foreground">
        <StatusLabel
          tone={
            item.status === 'resolved'
              ? 'success'
              : item.status === 'cancelled'
                ? 'neutral'
                : item.kind === 'beacon'
                  ? 'warning'
                  : 'official'
          }
        >
          {statusLabels[item.status]}
        </StatusLabel>
        {item.demo && <StatusLabel tone="demo">DEMO</StatusLabel>}
        <span className={item.kind === 'beacon' ? 'ml-1 inline-flex items-center gap-1 text-beacon' : 'ml-1'}>
          {item.kind === 'beacon' && <Radio className="size-3" aria-hidden />}
          {item.kind === 'offer' ? 'Offer' : item.kind === 'beacon' ? 'Beacon' : 'Need'}
        </span>
        <span aria-hidden>·</span>
        <span>{helpCategoryLabels[item.category]}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" aria-hidden />
          {item.kind === 'beacon'
            ? `${item.targetCommunityIds.length} ${item.targetCommunityIds.length === 1 ? 'community' : 'communities'}`
            : communityName}
        </span>
        <span aria-hidden>·</span>
        <span>
          {actorName(item.authorId)}, {formatCreatedAt(item.createdAt)}
        </span>
      </p>

      {activeUserResponse && (
        <div className="mt-4 rounded-[14px] bg-primary/10 px-3 py-2.5 text-sm leading-6 text-foreground">
          <p className="font-semibold">
            {activeUserResponse.acceptedByRequester ? 'Your offer was accepted' : 'Your offer is pending'}
          </p>
          <p className="text-muted-foreground">{activeUserResponse.note}</p>
        </div>
      )}

      {isOwner && itemResponses.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <h3 className="text-sm font-semibold text-foreground">
            {itemResponses.length} {itemResponses.length === 1 ? 'offer' : 'offers'} to help
          </h3>
          <ul className="mt-2 space-y-2">
            {itemResponses.map((response) => (
              <li key={response.id} className="rounded-[14px] bg-foreground/5 p-3">
                <p className="text-sm font-semibold text-foreground">
                  {actorName(response.responderId)}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{response.note}</p>
                {item.status === 'offered' && (
                  <Button
                    size="sm"
                    className="mt-3"
                    disabled={busy}
                    onClick={() =>
                      runAction(
                        () => onAccept(response.id),
                        () => success('Neighbour matched', 'Both participants now see the matched status.'),
                      )
                    }
                  >
                    <Check aria-hidden /> Accept offer
                  </Button>
                )}
                {response.acceptedByRequester && (
                  <p className="mt-2 text-xs font-semibold text-success">Accepted match</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {acceptedResponse && item.status === 'matched' && (
        <p className="mt-4 rounded-[14px] bg-success/12 px-3 py-2.5 text-sm font-medium text-foreground">
          Matched with {actorName(acceptedResponse.responderId)}. Arrange a safe public handoff.
        </p>
      )}

      {canRespond && !showResponse && (
        <Button className="mt-4" onClick={() => setShowResponse(true)}>
          <HandHeart aria-hidden /> I can help
        </Button>
      )}

      {showResponse && (
        <form className="mt-4 space-y-3" onSubmit={submitResponse}>
          <label className="block text-sm font-semibold text-foreground" htmlFor={`response-${item.id}`}>
            How can you help?
          </label>
          <Textarea
            id={`response-${item.id}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={240}
            rows={3}
            placeholder="I can lend a charger and meet somewhere public."
          />
          <p className="text-xs leading-5 text-muted-foreground">No phone numbers or addresses.</p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={busy}>Send offer</Button>
            <Button type="button" variant="ghost" onClick={() => setShowResponse(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {isOwner && item.status === 'matched' && (
        <Button
          className="mt-4"
          disabled={busy}
          onClick={() =>
            runAction(
              () => onResolve(item.id),
              () => success('Marked resolved', 'Thanks for closing the loop.'),
            )
          }
        >
          <Check aria-hidden /> Mark resolved
        </Button>
      )}

      {isOwner && !['resolved', 'cancelled'].includes(item.status) && (
        <Button
          variant="ghost"
          className="mt-4 text-muted-foreground"
          disabled={busy}
          onClick={() =>
            runAction(
              () => onCancel(item.id),
              () => warning('Request cancelled', 'It is no longer accepting help offers.'),
            )
          }
        >
          <X aria-hidden /> Cancel
        </Button>
      )}

      {!isOwner && item.status === 'cancelled' && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="size-4" aria-hidden />
          The owner cancelled this item.
        </p>
      )}
    </article>
  )
}
