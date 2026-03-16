import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { DashboardLayout } from '@/components/Layout/DashboardLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { GuestOnlyRoute } from '@/components/GuestOnlyRoute'

const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Analytics = lazy(() => import('@/pages/Analytics').then((m) => ({ default: m.Analytics })))
const Leads = lazy(() => import('@/pages/Leads').then((m) => ({ default: m.Leads })))
const KnowledgeBase = lazy(() =>
  import('@/pages/KnowledgeBase').then((m) => ({ default: m.KnowledgeBase }))
)
const Receptionist = lazy(() =>
  import('@/pages/Receptionist').then((m) => ({ default: m.Receptionist }))
)
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })))
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('@/pages/Signup').then((m) => ({ default: m.Signup })))

function PageFallback() {
  return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading…</div>
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnlyRoute>
        <Suspense fallback={<PageFallback />}>
          <Login />
        </Suspense>
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestOnlyRoute>
        <Suspense fallback={<PageFallback />}>
          <Signup />
        </Suspense>
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'leads', element: <Leads /> },
      { path: 'knowledge-base', element: <KnowledgeBase /> },
      { path: 'receptionist', element: <Receptionist /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export function Routes() {
  return <RouterProvider router={router} />
}
