import { createBrowserRouter, redirect } from 'react-router-dom'
import { AppShell } from './ui/AppShell.jsx'
import { RequireAuth } from './auth/RequireAuth.jsx'
import { LoginPage } from '../pages/Login.jsx'
import { DashboardPage } from '../pages/Dashboard.jsx'
import { CalendarPage } from '../pages/Calendar.jsx'
import { BookingsPage } from '../pages/Bookings.jsx'
import { Map3DPage } from '../pages/Map3D.jsx'

const BYPASS_AUTH =
  import.meta.env.DEV && String(import.meta.env.VITE_BYPASS_AUTH || '').toLowerCase() === 'true'

export const router = createBrowserRouter([
  {
    path: '/login',
    loader: async () => (BYPASS_AUTH ? redirect('/dashboard') : null),
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    loader: async () => redirect('/dashboard'),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'calendario', element: <CalendarPage /> },
      { path: 'prenotazioni', element: <BookingsPage /> },
      { path: 'mappa-3d', element: <Map3DPage /> },
    ],
  },
])

