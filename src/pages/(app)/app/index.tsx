import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BatteryCharging,
  BookOpen,
  ChevronRight,
  Clock3,
  ExternalLink,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Badge, Button, Modal } from '@/components/ui'
import { Card, SectionHeader } from '@/components/neighbourgrid'
import {
  demoOfficialState,
  demoPosts,
  demoUser,
  homeCommunity,
  postAuthors,
  resourceLinks,
} from '@/shared/demo-data'

export default function AppHomePage() {
  const [showDemoInfo, setShowDemoInfo] = useState(false)

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-9">
      <section className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary">Demo mode</Badge>
            <span className="text-xs font-medium text-muted-foreground">Fictional people and activity</span>
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Good evening, {demoUser.displayName}
          </h1>
          <button
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-muted-foreground transition hover:text-primary"
            onClick={() => setShowDemoInfo(true)}
          >
            <MapPin className="size-4 text-primary" aria-hidden />
            {homeCommunity.name}, {homeCommunity.municipality}
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground sm:flex">
          <span className="size-2 rounded-full bg-primary" />
          Community preview
        </span>
      </section>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <Card className="overflow-hidden border-0 bg-[#10243A] p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
                <HeartHandshake className="size-4" aria-hidden />
                Neighbours helping neighbours
              </span>
              <h2 className="mt-5 max-w-lg text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-4xl">
                How can your neighbours help?
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-white/68">
                Ask for a practical item or a hand with something nearby. Keep exact addresses
                and personal contact details private.
              </p>
            </div>
            <Sparkles className="hidden size-9 text-[#F3B34C] sm:block" aria-hidden />
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/app/help/new"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#10243A] transition hover:bg-white/90"
            >
              Ask for help
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/app/help"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15"
            >
              See community help board
            </Link>
          </div>
        </Card>

        <Card className="border-[#F3B34C]/45 bg-[#FFF8E8] p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#F3B34C]/25 text-[#7A5111]">
              <Radio className="size-5" aria-hidden />
            </span>
            <Badge className="bg-[#F3B34C]/25 text-[#6A4510]">High visibility</Badge>
          </div>
          <h2 className="mt-5 text-xl font-bold tracking-tight">Community Help Beacon</h2>
          <p className="mt-2 text-sm leading-6 text-[#5B6570]">
            Send an opt-in assistance request to selected communities. This does not contact
            emergency services.
          </p>
          <Link
            to="/app/beacon/new"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#D66A52] px-4 text-sm font-bold text-white transition hover:bg-[#C45E49]"
          >
            Learn about the beacon
          </Link>
          <p className="mt-3 text-xs font-medium text-[#6F6252]">Immediate danger? Call 911.</p>
        </Card>
      </div>

      <section className="mt-6 grid grid-cols-3 gap-3">
        {[
          [BatteryCharging, '2', 'Active requests'],
          [HeartHandshake, '3', 'Open offers'],
          [MessageCircle, '8', 'Community updates'],
        ].map(([Icon, value, label]) => {
          const SummaryIcon = Icon as typeof BatteryCharging
          return (
            <Card key={label as string} className="p-3 sm:p-5">
              <div className="flex items-center gap-2 text-primary">
                <SummaryIcon className="size-4" aria-hidden />
                <span className="hidden text-[11px] font-bold uppercase tracking-wider sm:inline">Demo</span>
              </div>
              <p className="mt-3 text-2xl font-bold">{value as string}</p>
              <p className="mt-1 text-[11px] font-semibold leading-4 text-muted-foreground sm:text-sm">
                {label as string}
              </p>
            </Card>
          )
        })}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section>
          <SectionHeader
            eyebrow="Official information"
            title="Stay grounded in verified sources"
            action={
              <a
                href={demoOfficialState.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View source <ExternalLink className="size-3.5" aria-hidden />
              </a>
            }
          />
          <Card className="p-5 sm:p-6">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/25 text-primary">Official source</Badge>
                  <span className="text-xs font-medium text-muted-foreground">{demoOfficialState.sourceName}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{demoOfficialState.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{demoOfficialState.description}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock3 className="size-3.5" aria-hidden />
                  Live feed connection planned for the next build
                </p>
              </div>
            </div>
          </Card>

          <Card className="mt-4 border-[#F3B34C]/40 bg-[#FFF8E8] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#D66A52] text-white">DEMO</Badge>
              <Badge className="bg-[#F3B34C]/30 text-[#6A4510]">SIMULATED SCENARIO</Badge>
            </div>
            <h3 className="mt-3 font-bold">Neighbourhood outage preparedness exercise</h3>
            <p className="mt-2 text-sm leading-6 text-[#5B6570]">
              Sample posts and counts on this page are fictional. They are included only to
              preview how community coordination could feel during a disruption.
            </p>
          </Card>
        </section>

        <section>
          <SectionHeader
            eyebrow="Newton community"
            title="From your neighbours"
            action={
              <Link to="/app/communities/newton" className="inline-flex min-h-11 items-center text-xs font-bold text-primary hover:underline">
                View all
              </Link>
            }
          />
          <div className="space-y-3">
            {demoPosts.map((post) => (
              <Link key={post.id} to="/app/communities/newton" className="block rounded-[22px] focus-visible:outline-none">
                <Card className="p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_15px_40px_rgba(16,36,58,0.09)]">
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      className={
                        post.kind === 'resource_offer'
                          ? 'bg-secondary text-primary'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {post.kind === 'resource_offer' ? 'Resource offer' : 'Discussion'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Demo · today</span>
                  </div>
                  <h3 className="mt-3 font-bold leading-6">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{postAuthors[post.authorId]}</span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="size-3.5" aria-hidden />
                      {post.kind === 'resource_offer' ? '5' : '12'}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <SectionHeader eyebrow="Preparedness resources" title="Before, during, and after" />
        <div className="grid gap-3 md:grid-cols-3">
          {resourceLinks.map((resource, index) => (
            <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer" className="group">
              <Card className="h-full p-5 transition group-hover:border-primary/35">
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                    {index === 0 ? <BookOpen className="size-4" /> : index === 1 ? <ShieldCheck className="size-4" /> : <Users className="size-4" />}
                  </span>
                  <ExternalLink className="size-4 text-muted-foreground transition group-hover:text-primary" aria-hidden />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">{resource.eyebrow}</p>
                <h3 className="mt-1 font-bold">{resource.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">Official resource · {resource.source}</p>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <Modal open={showDemoInfo} onClose={() => setShowDemoInfo(false)} size="sm">
        <Modal.Header>
          <Modal.Title>Newton is your demo home</Modal.Title>
          <Modal.Description>
            Community switching and saved preferences will be connected in the next build.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <div className="rounded-2xl bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
            This preview uses fictional residents and activity. It never requests your precise
            location.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setShowDemoInfo(false)}>Close</Button>
          <Button onClick={() => setShowDemoInfo(false)}>Keep Newton selected</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
