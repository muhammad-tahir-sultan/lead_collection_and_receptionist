import { Suspense, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import styles from './DashboardLayout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/leads', label: 'Leads' },
  { to: '/dashboard/knowledge-base', label: 'Knowledge base' },
  { to: '/dashboard/receptionist', label: 'AI Receptionist' },
  { to: '/dashboard/settings', label: 'Settings' },
] as const

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.hamburger}
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>
      {sidebarOpen && <div className={styles.overlay} onClick={closeSidebar} aria-hidden />}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
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
              onClick={closeSidebar}
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
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
