import { Link } from 'react-router-dom'
import { ComingSoon, placeholderIcons } from '@/components/neighbourgrid'

export default function ActivityPage() {
  return (
    <ComingSoon
      icon={placeholderIcons.activity}
      title="Activity"
      description="Replies, offers, and updates will collect here once the backend is connected."
      action={
        <Link
          to="/app"
          viewTransition
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Back to home
        </Link>
      }
    />
  )
}
