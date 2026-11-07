import { Navigate } from 'react-router-dom'

export default function DemoEntryPage() {
  return <Navigate to="/app?demo=1" replace />
}
