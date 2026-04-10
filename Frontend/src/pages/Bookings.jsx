import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { canDeleteBooking, normalizeBooking } from '../app/domain/bookings.js'
import { BookingModal } from '../components/BookingModal.jsx'

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function BookingsPage() {
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [aule, setAule] = useState([])
  const [classi, setClassi] = useState([])

  const [date, setDate] = useState(todayStr())
  const [aulaId, setAulaId] = useState('')
  const [classeId, setClasseId] = useState('')

  const canCreate = useMemo(() => {
    const role = (user?.ruolo ?? user?.role ?? '').toString().toLowerCase()
    return role === 'admin' || role === 'amministratore' || role === 'docente' || role === 'ata'
  }, [user])

  async function load() {
    setLoading(true)
    try {
      const [auleRes, classiRes] = await Promise.all([
        apiFetch('/aule', { token }),
        apiFetch('/classi', { token }),
      ])
      setAule(Array.isArray(auleRes) ? auleRes : auleRes?.data ?? [])
      setClassi(Array.isArray(classiRes) ? classiRes : classiRes?.data ?? [])

      const qs = new URLSearchParams()
      if (date) qs.set('data', date)
      if (aulaId) qs.set('aula_id', aulaId)
      if (classeId) qs.set('classe_id', classeId)

      const payload = await apiFetch(`/prenotazioni?${qs.toString()}`, { token })
      const list = Array.isArray(payload) ? payload : payload?.data ?? []
      setRows(list.map(normalizeBooking))
    } catch (e) {
      toast.error(e?.message || 'Errore caricamento prenotazioni')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, aulaId, classeId])

  async function deleteRow(id) {
    try {
      await apiFetch(`/prenotazioni/${id}`, { method: 'DELETE', token })
      toast.success('Prenotazione eliminata')
      await load()
    } catch (e) {
      toast.error(e?.message || 'Eliminazione non consentita')
    }
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Lista prenotazioni</div>
          <div className="muted">Filtra per data, aula o classe.</div>
        </div>
        <div className="toolbarRight">
          {canCreate ? (
            <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
              Nuova prenotazione
            </button>
          ) : null}
        </div>
      </header>

      <div className="glass" style={{ padding: 14 }}>
        <div className="toolbar" style={{ marginBottom: 12 }}>
          <div className="toolbarLeft">
            <div style={{ minWidth: 180 }}>
              <div className="label">Data</div>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ minWidth: 220 }}>
              <div className="label">Aula</div>
              <select className="select" value={aulaId} onChange={(e) => setAulaId(e.target.value)}>
                <option value="">Tutte</option>
                {aule.map((a) => {
                  const id = a?.id ?? a?.aula_id ?? a?.numero ?? a?.number
                  const numero = a?.numero ?? a?.number ?? id
                  return (
                    <option key={String(id)} value={String(id)}>
                      Aula {numero}
                    </option>
                  )
                })}
              </select>
            </div>
            <div style={{ minWidth: 260 }}>
              <div className="label">Classe</div>
              <select className="select" value={classeId} onChange={(e) => setClasseId(e.target.value)}>
                <option value="">Tutte</option>
                {classi.map((c) => {
                  const id = c?.id ?? c?.classe_id
                  const name = c?.nome ?? c?.name ?? `Classe ${id}`
                  return (
                    <option key={String(id)} value={String(id)}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className="toolbarRight">
            <button className="btn" disabled={loading} onClick={load}>
              Aggiorna
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Aula</th>
                <th>Data</th>
                <th>Inizio</th>
                <th>Fine</th>
                <th>Classi</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((r) => (
                  <tr key={String(r.id)}>
                    <td>{r.id}</td>
                    <td>{r.aulaNumero ?? r.aulaId ?? '—'}</td>
                    <td>{r.date ?? '—'}</td>
                    <td>{r.startTime ?? '—'}</td>
                    <td>{r.endTime ?? '—'}</td>
                    <td style={{ minWidth: 220 }}>
                      <span className="muted">
                        {r.classNames?.length ? r.classNames.join(', ') : '—'}
                      </span>
                    </td>
                    <td>
                      {canDeleteBooking({ booking: r, user }) ? (
                        <button
                          className="btn"
                          style={{ borderColor: 'rgba(255,77,109,0.45)' }}
                          onClick={() => deleteRow(r.id)}
                        >
                          Elimina
                        </button>
                      ) : (
                        <span className="muted" style={{ fontSize: 12 }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="muted" style={{ padding: 16, textAlign: 'center' }}>
                    Nessuna prenotazione trovata.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BookingModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={load} />
    </div>
  )
}

