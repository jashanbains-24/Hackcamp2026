/**
 * Landing page — a STATIC page.
 *
 * It lives at the top level of src/pages/ (not under (app)/), so it renders
 * with no DeepSpace providers: no auth session fetch, no records WebSocket.
 */

import { ArrowRight, HeartHandshake, MessageCircle, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/neighbourgrid'
import { NeighbourhoodGridCanvas } from '../components/NeighbourhoodGridCanvas'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

const loop = [
  { icon: MessageCircle, title: 'Talk locally', line: 'Neighbourhood conversation, every day.' },
  { icon: HeartHandshake, title: 'Help directly', line: 'Ask for or offer practical support.' },
  { icon: Radio, title: 'Coordinate carefully', line: 'An opt-in beacon — never dispatch.' },
] as const

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <div data-testid="static-landing" className="min-h-screen overflow-x-hidden">
        <a
          href="#landing-main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-foreground focus:shadow-lg"
        >
          Skip to content
        </a>

        <header className="fixed inset-x-0 top-0 z-20 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
          <div className="ng-glass-pill mx-auto flex h-13 max-w-[1180px] items-center justify-between pl-3 pr-1.5">
            <Link to="/" aria-label="NeighbourGrid home" className="rounded-full" viewTransition>
              <BrandMark />
            </Link>
            <Link
              to="/app"
              viewTransition
              className="ng-press inline-flex min-h-10 items-center rounded-full bg-foreground px-4 text-sm font-semibold text-background transition-[transform,opacity] duration-150 hover:opacity-90"
            >
              Open app
            </Link>
          </div>
        </header>

        <main id="landing-main">
          <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:min-h-[88svh]">
            <NeighbourhoodGridCanvas className="ng-scroll-motif absolute inset-0 -z-10 opacity-70" />

            <div className="relative z-10 mx-auto w-full max-w-[1180px]">
              <div className="mx-auto max-w-[40rem] text-center sm:mx-0 sm:text-left">
                <p className="ng-brand-reveal ng-type-brand ng-vt-brand text-foreground">
                  NeighbourGrid
                </p>
                <h1 className="ng-rise ng-rise-delay-1 ng-type-headline mx-auto mt-6 max-w-[18ch] text-foreground sm:mx-0">
                  Help is nearby.
                </h1>
                <p className="ng-rise ng-rise-delay-2 ng-type-lead mx-auto mt-3 max-w-[34ch] text-muted-foreground sm:mx-0">
                  Official updates, local talk, and opt-in help for your neighbourhood.
                </p>

                <div className="ng-rise ng-rise-delay-3 mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:justify-start">
                  <Link
                    to="/app"
                    viewTransition
                    className="ng-cta-primary ng-press inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-none transition-[transform,background-color] duration-150 hover:bg-primary-ink"
                  >
                    Open the app
                    <ArrowRight className="ng-cta-arrow size-4" aria-hidden />
                  </Link>
                  <Link
                    to="/demo"
                    viewTransition
                    className="inline-flex min-h-12 items-center text-sm font-semibold text-primary-ink hover:underline"
                  >
                    Preview demo
                  </Link>
                </div>

                <p className="ng-fade ng-type-meta mt-6 text-muted-foreground">
                  Approximate neighbourhoods only · Not an emergency service.
                </p>
              </div>
            </div>
          </section>

          <section className="px-5 pb-20 sm:px-8 sm:pb-28">
            <div className="mx-auto max-w-[1180px] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
              <h2 className="ng-scroll-copy ng-type-display mb-6 text-foreground lg:mb-0">
                One calm place for the hours when power feels uncertain.
              </h2>
              <ul className="ng-glass ng-row-divide overflow-hidden">
                {loop.map((step) => (
                  <li key={step.title} className="ng-scroll-step ng-row py-3.5">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary-ink"
                      aria-hidden
                    >
                      <step.icon className="size-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-foreground">{step.title}</span>
                      <span className="block text-sm text-muted-foreground">{step.line}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className="px-5 pb-10 sm:px-8">
            <div className="mx-auto flex max-w-[1180px] flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <BrandMark compact />
              <p className="ng-type-meta text-muted-foreground">
                HackCamp 2026 prototype · Community coordination, not emergency dispatch.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}
