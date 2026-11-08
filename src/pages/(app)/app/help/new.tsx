import { ArrowLeft } from 'lucide-react'
import { Button, useToast } from '@/components/ui'
import { BackLink } from '@/components/neighbourgrid'

export default function NewHelpPreviewPage() {
  const { info } = useToast()

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to="/app/help">
        <ArrowLeft className="size-4" aria-hidden /> Help board
      </BackLink>

      <div className="mt-4 border-t border-border pt-6">
        <h1 className="ng-type-display text-foreground">Ask for help</h1>
        <p className="ng-type-body mt-3 max-w-[48ch] text-muted-foreground">
          The full form and request lifecycle arrive in the help workstream.
        </p>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Avoid exact addresses, phone numbers, and sensitive medical details in public posts.
        </p>
        <Button
          className="mt-6 w-full"
          onClick={() =>
            info('Coming in the next build', 'The route and shared data contract are ready.')
          }
        >
          Preview request flow
        </Button>
      </div>
    </div>
  )
}
