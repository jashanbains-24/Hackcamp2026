import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { Button, useToast } from '@/components/ui'
import { BackLink } from '@/components/neighbourgrid'

export default function BeaconPreviewPage() {
  const { warning } = useToast()

  return (
    <div className="mx-auto max-w-[640px] px-4 py-5 sm:px-6 sm:py-7">
      <BackLink to="/app">
        <ArrowLeft className="size-4" aria-hidden /> Home
      </BackLink>

      <div className="mt-4 border-t border-border pt-6">
        <h1 className="ng-type-display text-foreground">Community Help Beacon</h1>
        <p className="ng-type-body mt-3 max-w-[42ch] text-muted-foreground">
          Opt-in help from Newton and eligible nearby communities. Nothing is sent in this preview.
        </p>

        <div className="mt-7 flex flex-col gap-4">
          <div
            className="ng-attend flex gap-3 rounded-xl border border-beacon/30 bg-beacon/8 p-4"
            role="note"
          >
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-beacon" aria-hidden />
            <p className="text-sm font-medium leading-6 text-foreground">
              Community volunteers may not respond. For immediate danger, call 911. This is not an
              emergency service.
            </p>
          </div>
          <Button
            className="h-12 w-full bg-beacon text-sm font-semibold text-beacon-foreground hover:bg-beacon/90 hover:text-beacon-foreground"
            onClick={() =>
              warning(
                'Demo only — nothing was sent',
                'Person C will implement confirmation, targeting, cooldowns, and owner controls.',
              )
            }
          >
            Preview confirmation
          </Button>
        </div>
      </div>
    </div>
  )
}
