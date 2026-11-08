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
          'grid size-9 place-items-center rounded-xl',
          inverted
            ? 'bg-white/15 text-white ring-1 ring-white/25'
            : 'bg-primary text-primary-foreground',
        )}
        aria-hidden
      >
        <LayoutGrid className="size-[17px]" strokeWidth={2.25} />
      </span>
      {!compact && (
        <span
          className={cn(
            'font-display text-xl font-semibold tracking-[-0.02em]',
            inverted ? 'text-white' : 'text-foreground',
          )}
        >
          NeighbourGrid
        </span>
      )}
    </span>
  )
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  )
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
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="ng-type-title-sm text-foreground">
          {title}
        </h2>
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
        'inline-flex min-h-7 items-center rounded-md px-2 text-xs font-semibold',
        tone === 'neutral' && 'bg-muted text-muted-foreground',
        tone === 'official' && 'bg-secondary text-foreground',
        tone === 'demo' && 'bg-muted text-foreground',
        tone === 'warning' && 'bg-advisory text-advisory-foreground',
        tone === 'help' && 'bg-destructive/10 text-destructive',
        tone === 'success' && 'bg-success/10 text-success',
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
      className={cn('h-20 rounded-xl ng-skeleton', className)}
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
    <div className="border border-dashed border-border px-5 py-10 text-center sm:px-8">
      <Icon className="mx-auto size-5 text-muted-foreground" aria-hidden />
      <h2 className="ng-type-title-sm mt-4 text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorPanel({
  title = 'Something went wrong',
  description = 'Please try again. If the problem continues, refresh the page.',
  action,
}: {
  title?: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5 sm:p-6" role="alert">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Shared back-control for nested dashboard routes. */
export function BackLink({
  to,
  children,
}: {
  to: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      viewTransition
      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
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
      <div className="w-full border-t border-border pt-8 text-center">
        <Icon className="mx-auto size-6 text-muted-foreground" aria-hidden />
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="ng-type-display text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 max-w-[48ch] text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
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

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-card focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:shadow-lg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <Link to="/app" viewTransition aria-label="NeighbourGrid home" className="rounded-xl">
            <span className="ng-vt-brand inline-flex">
              <BrandMark />
            </span>
          </Link>
          <Link
            to="/app/profile"
            viewTransition
            className="grid size-11 place-items-center rounded-full bg-secondary font-bold text-foreground ring-1 ring-border"
            aria-label="Open Maya's profile"
          >
            M
          </Link>
        </div>
      </header>

      <div className="flex min-h-dvh w-full">
        <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col border-r border-border bg-shell-panel px-3 py-5 lg:flex">
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
                    'inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  )}
                >
                  <item.icon className="size-[18px]" aria-hidden />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto border-t border-border px-1 pt-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Demo mode · Fictional Newton preview. Not an emergency service.
            </p>
            <Link
              to="/app/profile"
              viewTransition
              className="mt-3 inline-flex min-h-11 w-full items-center gap-2 rounded-lg px-1 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground">
                M
              </span>
              Maya
            </Link>
          </div>
        </aside>

        <main id="main-content" className="min-w-0 flex-1 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-sm lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {navItems.map((item) => {
            const active = isActive(pathname, item.to, item.exact)
            return (
              <Link
                key={item.to}
                to={item.to}
                viewTransition
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {active && (
                  <span
                    className="absolute inset-x-3 top-1 h-0.5 rounded-full bg-foreground"
                    aria-hidden
                  />
                )}
                <item.icon className="size-5" aria-hidden />
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
