import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'

const BYPASS_AUTH =
  import.meta.env.DEV && String(import.meta.env.VITE_BYPASS_AUTH || '').toLowerCase() === 'true'

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated && !BYPASS_AUTH) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

