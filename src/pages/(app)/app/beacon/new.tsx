import { Link } from 'react-router-dom'
import { ArrowLeft, Radio, ShieldAlert } from 'lucide-react'
import { Button, useToast } from '@/components/ui'
import { Card } from '@/components/neighbourgrid'

export default function BeaconPreviewPage() {
  const { warning } = useToast()

  return (
    <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6">
      <Link to="/app" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back home
      </Link>
      <Card className="mt-4 overflow-hidden border-[#F3B34C]/50">
        <div className="bg-[#FFF8E8] p-6 sm:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#F3B34C]/25 text-[#7A5111]">
            <Radio className="size-6" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#A26313]">Community assistance request</p>
          <h1 className="mt-2 text-2xl font-bold">Community Help Beacon</h1>
          <p className="mt-3 leading-7 text-[#5B6570]">
            This future form will let a resident request opt-in help from Newton and selected
            eligible nearby communities.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex gap-3 rounded-2xl border border-[#D66A52]/25 bg-[#D66A52]/8 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#B24F3B]" />
            <p className="text-sm font-medium leading-6 text-[#6A4B45]">
              Community volunteers may not respond. For immediate danger, call 911. This is not
              an emergency service.
            </p>
          </div>
          <Button
            className="mt-6 w-full bg-[#D66A52] hover:bg-[#C45E49]"
            onClick={() => warning('Demo only — nothing was sent', 'Person C will implement confirmation, targeting, cooldowns, and owner controls.')}
          >
            Preview confirmation
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            No request is broadcast from this Phase 0 preview.
          </p>
        </div>
      </Card>
    </div>
  )
}
