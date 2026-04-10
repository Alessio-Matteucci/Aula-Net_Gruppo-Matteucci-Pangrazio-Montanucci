import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { apiFetch } from '../api/client.js'

const STORAGE_KEY = 'aulanet.auth'
const BYPASS_AUTH =
  import.meta.env.DEV && String(import.meta.env.VITE_BYPASS_AUTH || '').toLowerCase() === 'true'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeStored(value) {
  try {
    if (!value) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // ignore
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    if (BYPASS_AUTH) {
      return {
        token: 'dev-bypass',
        user: {
          email: import.meta.env.VITE_BYPASS_EMAIL || 'test@example.com',
          nome: 'Test',
          ruolo: 'tester',
        },
      }
    }
    return readStored()
  })
  const token = session?.token ?? null
  const user = session?.user ?? null

  const logout = useCallback(() => {
    setSession(null)
    writeStored(null)
  }, [])

  const loginWithGoogle = useCallback(async ({ credential }) => {
    const payload = await apiFetch('/login/google', {
      method: 'POST',
      json: { credential },
    })

    const next = {
      token: payload?.token ?? payload?.accessToken ?? null,
      user: payload?.user ?? payload?.utente ?? null,
    }

    if (!next.token || !next.user) {
      throw new Error('Risposta login non valida: token/utente mancanti')
    }

    setSession(next)
    writeStored(next)
    return next
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      loginWithGoogle,
      logout,
      setSession,
    }),
    [token, user, loginWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider')
  return ctx
}

