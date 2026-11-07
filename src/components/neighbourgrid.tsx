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

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <LayoutGrid className="size-[18px]" aria-hidden />
      </span>
      {!compact && <span className="text-[17px] font-bold tracking-[-0.03em]">NeighbourGrid</span>}
    </span>
  )
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[22px] border border-border bg-card text-card-foreground shadow-[0_12px_36px_rgba(16,36,58,0.06)]',
        className,
      )}
      {...props}
    />
  )
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        )}
        <h2 className="text-xl font-bold tracking-[-0.025em] text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-label="Loading"
      className={cn('h-20 animate-pulse rounded-2xl bg-muted', className)}
    />
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
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center px-5 py-12">
      <Card className="w-full p-7 text-center sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Next build</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mx-auto mt-3 max-w-md leading-6 text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </Card>
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

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <Link to="/app" aria-label="NeighbourGrid home">
            <BrandMark />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Link
            to="/app/profile"
            className="grid size-11 place-items-center rounded-full bg-secondary font-bold text-primary ring-1 ring-border"
            aria-label="Open Maya's profile"
          >
            M
          </Link>
        </div>
      </header>

      <main className="pb-24 md:pb-8">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <item.icon className={cn('size-5', active && 'fill-primary/10')} aria-hidden />
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
