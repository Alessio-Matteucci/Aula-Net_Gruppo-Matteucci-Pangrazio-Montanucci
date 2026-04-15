import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card glass" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '32px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '64px', 
            height: '64px', 
            background: 'rgba(255, 77, 109, 0.15)', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: '16px' 
          }}>
            <AlertTriangle size={32} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--danger)', marginBottom: '8px' }}>
            404
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '750', letterSpacing: '0.3px', marginBottom: '8px' }}>
            Pagina non trovata
          </h1>
          <p className="muted" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="glass"
            style={{
              padding: '12px 20px',
              border: '1px solid var(--primary)',
              background: 'rgba(124, 58, 237, 0.15)',
              color: 'var(--text)',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(124, 58, 237, 0.25)'
              e.target.style.borderColor = 'var(--primary-2)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(124, 58, 237, 0.15)'
              e.target.style.borderColor = 'var(--primary)'
            }}
          >
            <Home size={16} />
            Torna alla Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="glass"
            style={{
              padding: '12px 20px',
              background: 'transparent',
              color: 'var(--text-2)',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.color = 'var(--text)'
              e.target.style.borderColor = 'var(--primary)'
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'var(--text-2)'
              e.target.style.borderColor = 'var(--border)'
            }}
          >
            <ArrowLeft size={16} />
            Indietro
          </button>
        </div>

        <div style={{ marginTop: '24px' }}>
          <p className="muted" style={{ fontSize: '13px', lineHeight: '1.4' }}>
            Se pensi che questo sia un errore, contatta l'amministratore del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
