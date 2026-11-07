import { ComingSoon, placeholderIcons } from '@/components/neighbourgrid'

export default function ActivityPage() {
  return (
    <ComingSoon
      icon={placeholderIcons.activity}
      title="Your activity, all together"
      description="Post replies, help offers, and community updates will appear here after the shared backend is connected."
    />
  )
}
