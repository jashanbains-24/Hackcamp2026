/**
 * Landing page — a STATIC page.
 *
 * It lives at the top level of src/pages/ (not under (app)/), so it renders
 * with no DeepSpace providers: no auth session fetch, no records WebSocket.
 */

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/neighbourgrid'
import { NeighbourhoodGridCanvas } from '../components/NeighbourhoodGridCanvas'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <div data-testid="static-landing" className="min-h-screen overflow-x-hidden bg-background">
        <a
          href="#landing-main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-foreground focus:shadow-lg"
        >
          Skip to content
        </a>

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:h-20 sm:px-8">
            <Link to="/" aria-label="NeighbourGrid home" className="rounded-xl" viewTransition>
              <BrandMark compact inverted />
            </Link>
            <Link
              to="/app"
              viewTransition
              className="inline-flex min-h-11 items-center rounded-full border border-white/35 bg-white/10 px-4 text-sm font-semibold text-navy-foreground transition hover:bg-white/16 active:scale-[0.98]"
            >
              Open demo
            </Link>
          </div>
        </header>

        <main id="landing-main">
          <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy px-5 pb-14 pt-28 text-navy-foreground sm:px-8 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-28">
            <div className="absolute inset-0 -z-10 ng-hero-surface ng-scroll-hero" aria-hidden>
              <NeighbourhoodGridCanvas className="ng-scroll-motif absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1180px]">
              <div className="ng-stack-copy">
                <p className="ng-brand-reveal ng-type-brand ng-vt-brand text-navy-foreground">
                  NeighbourGrid
                </p>
                <h1 className="ng-rise ng-rise-delay-1 ng-type-headline max-w-[18ch] text-navy-foreground">
                  Nearby help starts with a simple hello.
                </h1>
                <p className="ng-rise ng-rise-delay-2 ng-type-lead max-w-[36ch] tracking-[0.01em] text-white/85">
                  Connect with your neighbourhood during outages—share context, ask for practical
                  support, and show up for the people nearby.
                </p>
              </div>

              <div className="ng-rise ng-rise-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/app"
                  viewTransition
                  className="ng-cta-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-12px_rgba(16,36,58,0.6)] transition hover:bg-primary-ink active:scale-[0.98]"
                >
                  Explore Newton community
                  <ArrowRight className="ng-cta-arrow size-4" aria-hidden />
                </Link>
                <Link
                  to="/demo"
                  viewTransition
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-transparent px-7 text-sm font-semibold text-navy-foreground transition hover:bg-white/10 active:scale-[0.98]"
                >
                  Preview demo mode
                </Link>
              </div>

              <p className="ng-fade ng-type-meta mt-4 flex max-w-xl items-start gap-2.5 leading-6 text-white/75">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-white/88" aria-hidden />
                No precise location or personal contact details required. Not an emergency service.
              </p>
            </div>
          </section>

          <section className="bg-background px-5 py-16 sm:px-8 sm:py-24">
            <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
              <div className="ng-stack-copy ng-scroll-copy lg:sticky lg:top-16 lg:pt-1">
                <h2 className="ng-type-display text-foreground">
                  Built for the hours when power feels uncertain.
                </h2>
                <p className="ng-type-lead max-w-[42ch] text-muted-foreground">
                  NeighbourGrid keeps official updates, local conversation, and opt-in help in one
                  calm place—so neighbours can coordinate without confusing community support for
                  emergency response.
                </p>
              </div>

              <ul>
                <li className="ng-loop-step ng-stack-tight ng-scroll-step">
                  <p className="ng-type-title text-foreground">Talk locally</p>
                  <p className="ng-type-body max-w-[36ch] text-muted-foreground">
                    Useful neighbourhood conversations on ordinary days and during disruptions.
                  </p>
                </li>
                <li className="ng-loop-step ng-stack-tight ng-scroll-step">
                  <p className="ng-type-title text-foreground">Help directly</p>
                  <p className="ng-type-body max-w-[36ch] text-muted-foreground">
                    Request or offer everyday supplies with clear privacy boundaries.
                  </p>
                </li>
                <li className="ng-loop-step ng-stack-tight ng-scroll-step">
                  <p className="ng-type-title text-foreground">Coordinate carefully</p>
                  <p className="ng-type-body max-w-[36ch] text-muted-foreground">
                    Use a Community Help Beacon with limits—never emergency dispatch.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          <footer className="border-t border-border">
            <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <BrandMark />
              <p className="ng-type-meta max-w-md leading-6 text-muted-foreground sm:text-right">
                HackCamp 2026 prototype · Community coordination, not emergency dispatch.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
