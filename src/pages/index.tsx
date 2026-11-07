/**
 * Landing page — a STATIC page.
 *
 * It lives at the top level of src/pages/ (not under (app)/), so it renders
 * with no DeepSpace providers: no auth session fetch, no records WebSocket.
 * That makes it cheap to serve and safe for logged-out / crawler traffic.
 *
 * Need live data or auth here? Move this file to src/pages/(app)/index.tsx
 * and it becomes a dynamic page. Conversely, any page you want to keep static
 * (marketing, docs, legal) belongs at this top level.
 *
 * Top-level pages are also prerendered to static HTML at build
 * (prerender.ts, via vite.config.ts) so crawlers read real content.
 * Keep them renderable without a browser: no window/document during render,
 * prose in HTML text, reveal animations in CSS keyframes rather than JS-driven
 * initial states. `<Seo>` comes first and reads src/seo.ts.
 */

import { ArrowRight, CheckCircle2, HeartHandshake, MessageCircle, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark, Card } from '../components/neighbourgrid'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <div data-testid="static-landing" className="min-h-screen overflow-hidden bg-background">
        <header className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <Link
            to="/app"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/40"
          >
            Open demo
          </Link>
        </header>

        <main>
          <section className="relative mx-auto grid max-w-[1180px] gap-12 px-5 pb-20 pt-10 sm:px-8 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
                <span className="size-2 rounded-full bg-primary" />
                Built for neighbourhood connection
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
                Nearby help starts with a simple hello.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                A calm local hub to share context, ask for practical support, and show up for
                the people around you.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_28px_rgba(19,139,131,0.24)] transition hover:bg-primary/90"
                >
                  Explore Newton community
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-bold text-foreground transition hover:border-primary/40"
                >
                  Preview demo mode
                </Link>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" aria-hidden />
                No precise location or personal contact details required
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute -inset-12 -z-10 rounded-full bg-primary/10 blur-3xl" />
              <Card className="relative overflow-hidden p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-border px-1 pb-4">
                  <div>
                    <p className="text-xs font-bold text-primary">GOOD EVENING</p>
                    <p className="mt-1 text-xl font-bold">Newton, Surrey</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-secondary font-bold text-primary">M</span>
                </div>
                <div className="mt-4 rounded-2xl bg-[#10243A] p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/65">Neighbours are nearby</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">How can your community help?</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <span className="rounded-xl bg-white px-3 py-3 text-center text-xs font-bold text-[#10243A]">Ask for help</span>
                    <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center text-xs font-bold">Offer support</span>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border p-4">
                    <MessageCircle className="size-5 text-primary" aria-hidden />
                    <p className="mt-3 font-bold">Local conversation</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Useful every day, not only during disruptions.</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <HeartHandshake className="size-5 text-primary" aria-hidden />
                    <p className="mt-3 font-bold">Practical support</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Opt-in help with clear safety boundaries.</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="border-y border-border bg-card">
            <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
              {[
                [MessageCircle, 'Talk locally', 'Join useful conversations with people in your community.'],
                [HeartHandshake, 'Help directly', 'Request or offer everyday supplies and assistance.'],
                [Radio, 'Coordinate carefully', 'Use a community beacon with clear limits—not emergency dispatch.'],
              ].map(([Icon, title, copy]) => {
                const FeatureIcon = Icon as typeof MessageCircle
                return (
                  <div key={title as string} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                      <FeatureIcon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-bold">{title as string}</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy as string}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
