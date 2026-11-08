import { Check, Home, UserRoundPlus } from 'lucide-react'
import { Button } from '@/components/ui'
import { StatusLabel } from '@/components/neighbourgrid'
import { useMembership } from '@/services/communities'

export function CommunityMembership({
  communityId,
  isHome,
}: {
  communityId: string
  isHome: boolean
}) {
  const { membership, join, selectHome, isApproved } = useMembership(communityId)

  if (!membership) {
    return (
      <Button variant="outline" onClick={join}>
        <UserRoundPlus className="size-4" aria-hidden />
        Join community
      </Button>
    )
  }

  if (membership.status === 'pending') {
    return <StatusLabel tone="warning">Request pending</StatusLabel>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isHome ? (
        <StatusLabel tone="success">
          <Check className="mr-1 size-3.5" aria-hidden />
          Home community
        </StatusLabel>
      ) : (
        <Button variant="outline" onClick={() => void selectHome()}>
          <Home className="size-4" aria-hidden />
          Make home community
        </Button>
      )}
      {!isHome && isApproved && <StatusLabel>Member</StatusLabel>}
    </div>
  )
}
