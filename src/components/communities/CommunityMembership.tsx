import { Check, Home, UserRoundPlus } from 'lucide-react'
import { Button } from '@/components/ui'
import { StatusLabel } from '@/components/neighbourgrid'
import { useMembership } from '@/services/communities'

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

  if (!membership) {
    return (
      <Button variant="outline" size={size} onClick={join}>
        <UserRoundPlus className="size-4" aria-hidden />
        {compact ? <span className="sr-only">Join community</span> : 'Join community'}
        {compact && <span aria-hidden>Join</span>}
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
