import { Check, Home, UserRoundPlus } from 'lucide-react'
import { Button } from '@/components/ui'
import { StatusLabel } from '@/components/neighbourgrid'
import { getCommunityById, useMembership } from '@/services/communities'

export function CommunityMembership({
  communityId,
  isHome,
  compact = false,
  size = compact ? 'sm' : 'default',
}: {
  communityId: string
  isHome: boolean
  /** Icon-forward sizing for list rows; accessible names stay identical. */
  compact?: boolean
  /** Button size; defaults from `compact`. */
  size?: 'sm' | 'default'
}) {
  const { membership, join, selectHome, isApproved } = useMembership(communityId)
  const requestsJoin = getCommunityById(communityId)?.visibility === 'request_to_join'
  const actionLabel = requestsJoin ? 'Request to join' : 'Join community'
  const shortLabel = requestsJoin ? 'Request' : 'Join'

  if (!membership) {
    return (
      <Button variant="outline" size={size} onClick={join}>
        <UserRoundPlus className="size-4" aria-hidden />
        {compact ? <span className="sr-only">{actionLabel}</span> : actionLabel}
        {compact && <span aria-hidden>{shortLabel}</span>}
      </Button>
    )
  }

  if (membership.status === 'pending') {
    return <StatusLabel tone="warning">Request pending</StatusLabel>
  }

  // List rows already mark the home community beside its name.
  if (compact && isHome) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isHome ? (
        <StatusLabel tone="success">
          <Check className="mr-1 size-3" aria-hidden />
          Home community
        </StatusLabel>
      ) : (
        <Button variant="outline" size={size} onClick={() => void selectHome()}>
          <Home className="size-4" aria-hidden />
          {compact ? <span className="sr-only">Make home community</span> : 'Make home community'}
          {compact && <span aria-hidden>Set home</span>}
        </Button>
      )}
      {!isHome && isApproved && !compact && <StatusLabel>Member</StatusLabel>}
    </div>
  )
}
