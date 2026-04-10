import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './app/auth/AuthProvider.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const BYPASS_AUTH =
  import.meta.env.DEV && String(import.meta.env.VITE_BYPASS_AUTH || '').toLowerCase() === 'true'

function MissingEnvBanner({ name }) {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        padding: 16,
        maxWidth: 780,
        margin: '24px auto',
        lineHeight: 1.4,
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        background: 'rgba(255, 60, 60, 0.10)',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        Configurazione mancante
      </div>
      <div>
        Variabile <code>{name}</code> non impostata. Crea <code>Frontend/.env</code>{' '}
        e riavvia il dev server.
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {BYPASS_AUTH ? (
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    ) : googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </GoogleOAuthProvider>
    ) : (
      <>
        <MissingEnvBanner name="VITE_GOOGLE_CLIENT_ID" />
        <Toaster position="top-right" />
      </>
    )}
  </StrictMode>,
)
