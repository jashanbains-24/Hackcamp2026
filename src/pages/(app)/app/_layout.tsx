import { Outlet } from 'react-router-dom'
import { AppShell } from '@/components/neighbourgrid'

export default function NeighbourGridAppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
