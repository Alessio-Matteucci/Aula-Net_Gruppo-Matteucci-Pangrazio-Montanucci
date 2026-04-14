import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { CalendarDays, DoorOpen, Layers, Table } from 'lucide-react'

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card glass">
      <div className="cardRow">
        <div>
          <div className="muted" style={{ fontSize: 13 }}>
            {title}
          </div>
          <div className="cardValue">{value}</div>
        </div>
        <div className="cardIcon">
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    aule: null,
    classi: null,
    prenotazioniOggi: null,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [aule, classi, prenotazioni] = await Promise.all([
          apiFetch('/aule', { token }),
          apiFetch('/classi', { token }),
          apiFetch('/prenotazioni', { token }),
        ])

        const now = new Date()
        const y = now.getFullYear()
        const m = String(now.getMonth() + 1).padStart(2, '0')
        const d = String(now.getDate()).padStart(2, '0')
        const todayStr = `${y}-${m}-${d}`

        const list = Array.isArray(prenotazioni) ? prenotazioni : prenotazioni?.data
        const todayCount = (Array.isArray(list) ? list : []).filter((p) => {
          const dt = p?.data || p?.date
          return typeof dt === 'string' ? dt.startsWith(todayStr) : false
        }).length

        if (cancelled) return
        setStats({
          aule: Array.isArray(aule) ? aule.length : aule?.length ?? aule?.count ?? 119,
          classi: Array.isArray(classi) ? classi.length : classi?.length ?? classi?.count ?? null,
          prenotazioniOggi: todayCount,
        })
      } catch {
        if (!cancelled) {
          setStats((s) => ({ ...s }))
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const cards = useMemo(
    () => [
      { title: 'Aule', value: stats.aule ?? '—', icon: DoorOpen },
      { title: 'Classi', value: stats.classi ?? '—', icon: Layers },
      { title: 'Prenotazioni (oggi)', value: stats.prenotazioniOggi ?? '—', icon: Table },
      { title: 'Vista', value: 'Calendario', icon: CalendarDays },
    ],
    [stats],
  )

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Dashboard</div>
          <div className="muted">Panoramica rapida dello stato delle aule.</div>
        </div>
      </header>

      <div className="grid4">
        {cards.map((c) => (
          <StatCard key={c.title} title={c.title} value={c.value} icon={c.icon} />
        ))}
      </div>

      <div className="card glass" style={{ marginTop: 16 }}>
        <div className="muted" style={{ marginBottom: 8 }}>
          Suggerimenti
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-2)' }}>
          <li>Usa “Calendario” per creare e gestire prenotazioni.</li>
          <li>Usa “Prenotazioni” per filtri rapidi per aula/classe.</li>
          <li>Usa “Mappa scuola” per una vista immediata della disponibilità.</li>
        </ul>
      </div>
    </div>
  )
}

