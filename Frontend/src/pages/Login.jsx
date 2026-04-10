import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../app/auth/AuthProvider.jsx'

export function LoginPage() {
  const { loginWithGoogle, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="loginRoot">
      <div className="loginCard glass">
        <div className="loginHeader">
          <div className="loginTitle">Accedi ad Aula-Net</div>
          <div className="muted">
            Accesso consentito solo a utenti presenti nel database.
          </div>
        </div>

        <div className="loginBody">
          <GoogleLogin
            onSuccess={async (res) => {
              try {
                const credential = res?.credential
                if (!credential) {
                  toast.error('Credenziali Google mancanti')
                  return
                }
                await toast.promise(loginWithGoogle({ credential }), {
                  loading: 'Accesso in corso…',
                  success: 'Accesso effettuato',
                  error: (e) => e?.message || 'Accesso negato',
                })
                navigate('/dashboard', { replace: true })
              } catch (e) {
                toast.error(e?.message || 'Accesso negato')
              }
            }}
            onError={() => toast.error('Login Google fallito')}
            useOneTap
          />
        </div>

        <div className="loginFooter muted">
          Se la tua email non è registrata, contatta l’amministratore.
        </div>
      </div>
    </div>
  )
}

