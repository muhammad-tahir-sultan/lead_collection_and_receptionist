import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

type Props = { children: React.ReactNode }

/** Renders children only when unauthenticated; redirects to dashboard when logged in. */
export function GuestOnlyRoute({ children }: Props) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }

  if (state.status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
