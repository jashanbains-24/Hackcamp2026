import { MapPin, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui'
import { Card } from '@/components/neighbourgrid'
import { demoUser, homeCommunity } from '@/shared/demo-data'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">Demo profile</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Your neighbourhood profile</h1>
      <Card className="mt-7 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-secondary text-xl font-bold text-primary">M</span>
          <div>
            <h2 className="text-xl font-bold">{demoUser.displayName}</h2>
            <Badge className="mt-2 bg-primary/10 text-primary">Fictional demo user</Badge>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <MapPin className="size-5 text-primary" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Home community</p>
            <p className="mt-1 font-bold">{homeCommunity.name}, {homeCommunity.municipality}</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <ShieldCheck className="size-5 text-primary" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Privacy</p>
            <p className="mt-1 font-bold">Approximate area only</p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          Account controls and persisted home-community selection arrive in Person A’s platform workstream.
        </p>
      </Card>
    </div>
  )
}
