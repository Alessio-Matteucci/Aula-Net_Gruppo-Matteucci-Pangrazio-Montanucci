import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { normalizeBooking } from '../app/domain/bookings.js'
import { Clock, MapPin, Users, Calendar } from 'lucide-react'

function formatEventDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Oggi'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Domani'
  } else {
    return date.toLocaleDateString('it-IT', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }
}

function isEventInFuture(dateStr, timeStr) {
  const eventDateTime = new Date(`${dateStr}T${timeStr}`)
  return eventDateTime > new Date()
}

export function UpcomingEvents() {
  const { token, user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadUserBookings() {
      setLoading(true)
      try {
        const qs = new URLSearchParams()
        qs.set('limit', '10') // Limit to next 10 events
        
        // If user has admin role, we might want to see all, but for now show user's bookings
        const userId = user?.id ?? user?.utente_id
        const userEmail = user?.email
        if (userId) {
          qs.set('utente_id', userId)
        } else if (userEmail) {
          qs.set('utente_email', userEmail)
        }

        const payload = await apiFetch(`/prenotazioni?${qs.toString()}`, { token })
        const list = Array.isArray(payload) ? payload : payload?.data ?? []
        
        if (!cancelled) {
          setBookings(list.map(normalizeBooking))
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Errore caricamento prenotazioni utente:', e)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadUserBookings()
    return () => {
      cancelled = true
    }
  }, [token, user])

  const upcomingEvents = useMemo(() => {
    return bookings
      .filter(booking => {
        if (!booking.date || !booking.startTime) return false
        return isEventInFuture(booking.date, booking.startTime)
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`)
        const dateB = new Date(`${b.date}T${b.startTime}`)
        return dateA - dateB
      })
      .slice(0, 5) // Show max 5 upcoming events
  }, [bookings])

  if (loading) {
    return (
      <div className="card glass">
        <div className="muted" style={{ marginBottom: 12 }}>
          I tuoi prossimi eventi
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-2)' }}>
          Caricamento...
        </div>
      </div>
    )
  }

  if (!upcomingEvents.length) {
    return (
      <div className="card glass">
        <div className="muted" style={{ marginBottom: 12 }}>
          I tuoi prossimi eventi
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-2)' }}>
          Nessun evento imminente
        </div>
      </div>
    )
  }

  return (
    <div className="card glass">
      <div className="muted" style={{ marginBottom: 16 }}>
        I tuoi prossimi eventi
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            style={{
              padding: '12px',
              background: 'rgba(124, 58, 237, 0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              // Usa `currentTarget` per evitare che, passando sopra elementi figli,
              // venga modificato (e poi non resettato) il nodo sbagliato.
              e.currentTarget.style.background = 'rgba(124, 58, 237, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {event.aulaNumero ? `Aula ${event.aulaNumero}` : 'Aula sconosciuta'}
                </div>
                {event.classNames.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-2)', fontSize: '12px' }}>
                    <Users size={12} />
                    <span>{event.classNames.join(', ')}</span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-2)' }}>
                  {formatEventDate(event.date)}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                <span>{event.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {upcomingEvents.length >= 5 && (
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <div className="muted" style={{ fontSize: '12px' }}>
            Mostrati i prossimi 5 eventi
          </div>
        </div>
      )}
    </div>
  )
}
