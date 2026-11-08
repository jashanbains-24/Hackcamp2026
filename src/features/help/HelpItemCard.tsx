import { useState, type FormEvent } from 'react'
import { Check, HandHeart, MapPin, Radio, RotateCcw, X } from 'lucide-react'
import { Button, Textarea, useToast } from '@/components/ui'
import { StatusLabel } from '@/components/neighbourgrid'
import type { HelpItem, HelpResponse } from '@/shared/types'
import {
  getActorName,
  helpCategoryLabels,
  helpDemoActions,
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
}: {
  item: HelpItem
  responses: HelpResponse[]
  activeUserId: string
}) {
  const { success, warning } = useToast()
  const [showResponse, setShowResponse] = useState(false)
  const [note, setNote] = useState('')
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

  function submitResponse(event: FormEvent) {
    event.preventDefault()
    const trimmed = note.trim()
    if (trimmed.length < 3) {
      warning('Add a short note', 'Say what kind of help you can offer.')
      return
    }
    const response = helpDemoActions.respond(item.id, trimmed)
    if (!response) {
      warning('Could not send the offer', 'This request may no longer be available.')
      return
    }
    setNote('')
    setShowResponse(false)
    success('Offer shared', 'The requester can now review your note.')
  }

  return (
    <article
      className={
        item.kind === 'beacon'
          ? 'rounded-xl border border-beacon/35 bg-beacon/5 p-4 sm:p-5'
          : 'border-b border-border py-5 last:border-b-0'
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusLabel tone={item.kind === 'beacon' ? 'help' : 'neutral'}>
          {item.kind === 'request'
            ? 'Need help'
            : item.kind === 'offer'
              ? 'Can offer'
              : 'Community assistance request'}
        </StatusLabel>
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
      </div>

      <h2 className="ng-type-title-sm mt-3 text-foreground">{item.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
        <span>{helpCategoryLabels[item.category]}</span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          Newton
        </span>
        <span>
          {getActorName(item.authorId)} · {formatCreatedAt(item.createdAt)}
        </span>
      </div>

      {item.kind === 'beacon' && (
        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-beacon">
          <Radio className="size-3.5" aria-hidden />
          Shared with {item.targetCommunityIds.length} demo{' '}
          {item.targetCommunityIds.length === 1 ? 'community' : 'communities'}
        </p>
      )}

      {activeUserResponse && (
        <div className="mt-4 rounded-lg bg-secondary px-3 py-3 text-sm leading-6 text-foreground">
          <p className="font-semibold">
            {activeUserResponse.acceptedByRequester ? 'Your offer was accepted' : 'Your offer is pending'}
          </p>
          <p className="mt-1 text-muted-foreground">{activeUserResponse.note}</p>
        </div>
      )}

      {isOwner && itemResponses.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground">
            {itemResponses.length} {itemResponses.length === 1 ? 'offer' : 'offers'} to help
          </h3>
          <ul className="mt-2 space-y-2">
            {itemResponses.map((response) => (
              <li key={response.id} className="rounded-lg bg-muted/65 p-3">
                <p className="text-sm font-semibold text-foreground">
                  {getActorName(response.responderId)}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{response.note}</p>
                {item.status === 'offered' && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      if (helpDemoActions.acceptResponse(response.id)) {
                        success('Neighbour matched', 'Both participants now see the matched status.')
                      }
                    }}
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
        <p className="mt-4 rounded-lg bg-success/10 px-3 py-2.5 text-sm font-medium text-foreground">
          Matched with {getActorName(acceptedResponse.responderId)}. Agree on a safe public handoff
          without posting contact details here.
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
            placeholder="I can lend a charger and meet at a public place nearby."
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Keep phone numbers, addresses, and private details out of this note.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Send offer</Button>
            <Button type="button" variant="ghost" onClick={() => setShowResponse(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {isOwner && item.status === 'matched' && (
        <Button
          className="mt-4"
          onClick={() => {
            if (helpDemoActions.resolve(item.id)) {
              success('Marked resolved', 'Thanks for closing the loop.')
            }
          }}
        >
          <Check aria-hidden /> Mark resolved
        </Button>
      )}

      {isOwner && !['resolved', 'cancelled'].includes(item.status) && (
        <Button
          variant="ghost"
          className="mt-4 text-muted-foreground"
          onClick={() => {
            if (helpDemoActions.cancel(item.id)) {
              warning('Request cancelled', 'It is no longer accepting help offers.')
            }
          }}
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
