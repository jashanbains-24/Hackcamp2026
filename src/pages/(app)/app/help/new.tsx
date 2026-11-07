import { Link } from 'react-router-dom'
import { ArrowLeft, ClipboardPenLine } from 'lucide-react'
import { Button, useToast } from '@/components/ui'
import { Card } from '@/components/neighbourgrid'

export default function NewHelpPreviewPage() {
  const { info } = useToast()

  return (
    <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6">
      <Link to="/app/help" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Help board
      </Link>
      <Card className="mt-4 p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          <ClipboardPenLine className="size-5" />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">Phase 0 preview</p>
        <h1 className="mt-2 text-2xl font-bold">Create a help request</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          The working form, validation, privacy guidance, and request lifecycle belong to Person
          C’s help and beacon workstream. This route is ready for that implementation.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
          Safety reminder: avoid exact home addresses, phone numbers, and sensitive medical
          information in public posts.
        </div>
        <Button className="mt-6 w-full" onClick={() => info('Coming in the next build', 'The route and shared data contract are ready.')}>
          Preview request flow
        </Button>
      </Card>
    </div>
  )
}
