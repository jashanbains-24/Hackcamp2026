import type { ComponentType, HTMLAttributes, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bell,
  CircleHelp,
  HeartHandshake,
  Home,
  LayoutGrid,
  LoaderCircle,
  MapPin,
  MessageCircle,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNeighbourGridSession } from '@/neighbourgrid/session'

export function BrandMark({
  compact = false,
  inverted = false,
}: {
  compact?: boolean
  inverted?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={cn(
          'grid size-8 place-items-center rounded-[10px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]',
          inverted ? 'bg-white/15 text-white ring-1 ring-white/25' : 'bg-primary text-primary-foreground',
        )}
        aria-hidden
      >
        <LayoutGrid className="size-4" strokeWidth={2.25} />
      </span>
      {!compact && (
        <span
          className={cn(
            'font-display text-lg font-semibold tracking-[-0.02em]',
            inverted ? 'text-white' : 'text-foreground',
          )}
        >
          NeighbourGrid
        </span>
      )}
    </span>
  )
}

/** Translucent glass pane — the primary container of the system. */
export function Pane({
  className,
  strong = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return <div className={cn(strong ? 'ng-glass-strong' : 'ng-glass', className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ng-glass text-card-foreground', className)} {...props} />
}

export function SectionHeader({
  title,
  action,
  description,
}: {
  title: string
  action?: ReactNode
  description?: string
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4 px-1">
      <div className="min-w-0">
        <h2 className="ng-type-title-sm text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function StatusLabel({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'neutral' | 'official' | 'demo' | 'warning' | 'help' | 'success'
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-full px-2 text-[11px] font-semibold leading-none tracking-[0.01em]',
        tone === 'neutral' && 'bg-foreground/8 text-muted-foreground',
        tone === 'official' && 'bg-primary/12 text-primary-ink',
        tone === 'demo' && 'bg-foreground/8 text-foreground',
        tone === 'warning' && 'bg-advisory text-advisory-foreground',
        tone === 'help' && 'bg-beacon/12 text-beacon',
        tone === 'success' && 'bg-success/14 text-success',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('h-16 rounded-[18px] ng-skeleton', className)}
    />
  )
}

export function EmptyPanel({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="ng-glass px-5 py-9 text-center">
      <Icon className="mx-auto size-5 text-muted-foreground" aria-hidden />
      <h2 className="ng-type-title-sm mt-3 text-foreground">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorPanel({
  title = 'Something went wrong',
  description = 'Try again or refresh.',
  action,
}: {
  title?: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="ng-glass border-destructive/25 p-4 sm:p-5" role="alert">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Shared back-control for nested dashboard routes. */
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      viewTransition
      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary-ink transition hover:opacity-80"
    >
      {children}
    </Link>
  )
}

export function ComingSoon({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-10 sm:px-6">
      <div className="ng-glass w-full px-6 py-10 text-center">
        <Icon className="mx-auto size-6 text-muted-foreground" aria-hidden />
        <h1 className="ng-type-title mt-4 text-foreground">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <h1 className="ng-type-display text-foreground">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-[44ch] text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/** One-line quiet footnote for disclaimers and provenance. */
export function Footnote({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('ng-type-meta px-1 text-center leading-5 text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

const navItems = [
  { to: '/app', label: 'Home', icon: Home, exact: true },
  { to: '/app/communities', label: 'Communities', icon: MessageCircle, exact: false },
  { to: '/app/help', label: 'Help', icon: HeartHandshake, exact: false },
  { to: '/app/activity', label: 'Activity', icon: Bell, exact: false },
  { to: '/app/profile', label: 'Profile', icon: UserRound, exact: false },
] as const

function isActive(pathname: string, to: string, exact: boolean) {
  return exact ? pathname === to : pathname.startsWith(to)
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const session = useNeighbourGridSession()
  const initial = session.displayName.slice(0, 1).toUpperCase() || 'N'
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => isActive(pathname, item.to, item.exact)),
  )
  const modeLine = session.isDemo
    ? 'Demo · fictional data'
    : session.mode === 'authenticated'
      ? session.homeCommunity.name
      : 'Sign in from Profile'

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-card focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="flex min-h-dvh w-full">
        {/* Desktop: floating glass rail */}
        <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 p-4 lg:block">
          <div className="ng-glass flex h-full flex-col px-3 py-5">
            <Link
              to="/app"
              viewTransition
              aria-label="NeighbourGrid home"
              className="mx-1 mb-8 rounded-xl px-1"
            >
              <span className="ng-vt-brand inline-flex">
                <BrandMark />
              </span>
            </Link>
            <nav className="flex flex-1 flex-col gap-1" aria-label="Primary navigation">
              {navItems.map((item) => {
                const active = isActive(pathname, item.to, item.exact)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    viewTransition
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'ng-press inline-flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-sm font-semibold transition-[color,background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)]',
                      active
                        ? 'bg-glass-strong text-foreground shadow-[inset_0_1px_0_0_var(--color-glass-highlight),0_1px_2px_rgba(16,36,58,0.08)]'
                        : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                    )}
                  >
                    <item.icon className="size-[18px]" aria-hidden />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto border-t border-border px-1 pt-4">
              <Link
                to="/app/profile"
                viewTransition
                className="inline-flex min-h-11 w-full items-center gap-2.5 rounded-[14px] px-1 text-sm font-semibold text-foreground hover:bg-foreground/5"
              >
                <span className="grid size-8 place-items-center rounded-full bg-foreground/8 text-sm font-bold text-foreground">
                  {initial}
                </span>
                <span className="min-w-0">
                  <span className="block truncate">{session.displayName}</span>
                  <span className="block truncate text-xs font-medium text-muted-foreground">
                    {modeLine}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          className="min-w-0 flex-1 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))] lg:pb-8 lg:pt-0"
        >
          {children}
        </main>
      </div>

      {/* Mobile: floating glass tab bar with sliding indicator */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="ng-glass-pill relative mx-auto grid h-16 max-w-md grid-cols-5 p-1.5">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/5)] rounded-full bg-foreground/8 shadow-[inset_0_1px_0_0_var(--color-glass-highlight)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {navItems.map((item) => {
            const active = isActive(pathname, item.to, item.exact)
            return (
              <Link
                key={item.to}
                to={item.to}
                viewTransition
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'ng-press relative z-10 flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full text-[10.5px] font-semibold transition-[color,transform] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)]',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <item.icon className="size-[22px]" strokeWidth={active ? 2.25 : 1.9} aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export const placeholderIcons = {
  activity: Bell,
  communities: MessageCircle,
  help: HeartHandshake,
  profile: UserRound,
  beacon: CircleHelp,
  location: MapPin,
  loading: LoaderCircle,
}
