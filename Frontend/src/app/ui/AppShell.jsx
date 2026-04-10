import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { CalendarDays, LayoutDashboard, LogOut, Map, Table } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/prenotazioni', label: 'Prenotazioni', icon: Table },
  { to: '/mappa-3d', label: 'Mappa 3D', icon: Map },
]

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = useMemo(() => {
    return user?.nome || user?.name || user?.email || 'Utente'
  }, [user])
  const role = user?.ruolo || user?.role || null

  return (
    <div className="app">
      <aside className="sidebar glass">
        <div className="brand">
          <div className="brandMark" />
          <div className="brandText">
            <div className="brandName">Aula-Net</div>
            <div className="brandSub muted">Prenotazione Aule</div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((it) => {
            const Icon = it.icon
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `navItem ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{it.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebarFooter">
          <div className="userCard">
            <div className="avatar">{String(displayName).slice(0, 2).toUpperCase()}</div>
            <div className="userMeta">
              <div className="userName">{displayName}</div>
              <div className="userRole muted">{role ? String(role) : '—'}</div>
            </div>
          </div>
          <button
            className="btn"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <LogOut size={18} />
            <span style={{ marginLeft: 8 }}>Esci</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

