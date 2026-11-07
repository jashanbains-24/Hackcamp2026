import { Link } from 'react-router-dom'
import { BatteryCharging, HeartHandshake, Plus } from 'lucide-react'
import { Badge } from '@/components/ui'
import { Card, SectionHeader } from '@/components/neighbourgrid'

export default function HelpBoardPage() {
  return (
    <div className="mx-auto max-w-[920px] px-4 py-8 sm:px-6">
      <SectionHeader
        eyebrow="Demo help board"
        title="Practical help, close to home"
        action={
          <Link to="/app/help/new" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white">
            <Plus className="size-4" /> New
          </Link>
        }
      />
      <p className="-mt-2 mb-7 max-w-2xl leading-6 text-muted-foreground">
        These fictional cards preview the request and offer system. Matching and live status
        updates are intentionally reserved for the help workstream.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Badge className="bg-[#D66A52]/12 text-[#B24F3B]">Need help · Demo</Badge>
            <Badge variant="outline">Open</Badge>
          </div>
          <BatteryCharging className="mt-5 size-6 text-primary" />
          <h2 className="mt-3 text-lg font-bold">Portable charger for tonight</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Fictional Newton request with no address or personal contact details.
          </p>
          <button className="mt-5 min-h-11 w-full rounded-xl bg-primary/10 text-sm font-bold text-primary">
            Preview only
          </button>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/10 text-primary">Can offer · Demo</Badge>
            <Badge variant="outline">Open</Badge>
          </div>
          <HeartHandshake className="mt-5 size-6 text-primary" />
          <h2 className="mt-3 text-lg font-bold">Two battery lanterns to lend</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Public handoff details would be agreed safely after an offer is accepted.
          </p>
          <button className="mt-5 min-h-11 w-full rounded-xl border border-border text-sm font-bold text-muted-foreground">
            Preview only
          </button>
        </Card>
      </div>
    </div>
  )
}
