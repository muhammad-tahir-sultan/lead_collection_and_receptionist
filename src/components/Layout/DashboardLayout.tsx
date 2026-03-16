import { Suspense } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import styles from './DashboardLayout.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/leads', label: 'Leads' },
  { to: '/knowledge-base', label: 'Knowledge base' },
  { to: '/receptionist', label: 'AI Receptionist' },
  { to: '/settings', label: 'Settings' },
] as const

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>◇</span>
          <span>Receptionist</span>
        </div>
        <nav className={styles.nav} aria-label="Main">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? styles.navLinkActive : styles.navLink}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className={styles.userBar}>
          <span className={styles.userName} title={user?.email ?? ''}>
            {user?.name ?? user?.email ?? 'User'}
          </span>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
          >
            Log out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
