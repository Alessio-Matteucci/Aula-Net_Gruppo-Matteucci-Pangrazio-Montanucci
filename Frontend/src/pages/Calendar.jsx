import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { useSearchParams } from 'react-router-dom'
import {
  bookingToFullCalendarEvent,
  canDeleteBooking,
  normalizeBooking,
} from '../app/domain/bookings.js'
import { BookingModal } from '../components/BookingModal.jsx'
import { Modal } from '../components/Modal.jsx'

function toTimeStr(date) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function CalendarPage() {
  const { token, user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [range, setRange] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [createPreset, setCreatePreset] = useState(null)
  const [selected, setSelected] = useState(null)
  const [aule, setAule] = useState([])
  const [classi, setClassi] = useState([])

  const filterAula = searchParams.get('aula') || ''
  const filterClasse = searchParams.get('classe') || ''

  const canCreate = useMemo(() => {
    const role = (user?.ruolo ?? user?.role ?? '').toString().toLowerCase()
    return role === 'admin' || role === 'amministratore' || role === 'docente' || role === 'ata'
  }, [user])

  const load = useCallback(async () => {
    if (!range) return
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      qs.set('start', toDateStr(range.start))
      qs.set('end', toDateStr(range.end))
      if (filterAula) qs.set('aula_id', filterAula)
      if (filterClasse) qs.set('classe_id', filterClasse)
      const payload = await apiFetch(`/prenotazioni?${qs.toString()}`, { token })
      const list = Array.isArray(payload) ? payload : payload?.data ?? []
      const normalized = list.map(normalizeBooking)
      setEvents(normalized.map(bookingToFullCalendarEvent))
    } catch (e) {
      toast.error(e?.message || 'Errore caricamento prenotazioni')
    } finally {
      setLoading(false)
    }
  }, [range, token, filterAula, filterClasse])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let cancelled = false
    async function loadFilters() {
      try {
        const [auleRes, classiRes] = await Promise.all([
          apiFetch('/aule', { token }),
          apiFetch('/classi', { token }),
        ])
        if (cancelled) return
        setAule(Array.isArray(auleRes) ? auleRes : auleRes?.data ?? [])
        setClassi(Array.isArray(classiRes) ? classiRes : classiRes?.data ?? [])
      } catch {
        // ignore
      }
    }
    loadFilters()
    return () => {
      cancelled = true
    }
  }, [token])

  async function deleteSelected() {
    const b = selected?.booking
    if (!b?.id) return
    try {
      await apiFetch(`/prenotazioni/${b.id}`, { method: 'DELETE', token })
      toast.success('Prenotazione eliminata')
      setSelected(null)
      await load()
    } catch (e) {
      toast.error(e?.message || 'Eliminazione non consentita')
    }
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Calendario</div>
          <div className="muted">Giorno, settimana e mese. Clicca e trascina per creare.</div>
        </div>
        <div className="toolbarRight">
          {canCreate ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                setCreatePreset(null)
                setCreateOpen(true)
              }}
            >
              Nuova prenotazione
            </button>
          ) : null}
        </div>
      </header>

      <div className="glass" style={{ padding: 14 }}>
        <div className="toolbar">
          <div className="toolbarLeft">
            <div style={{ minWidth: 220 }}>
              <div className="label">Filtro aula</div>
              <select
                className="select"
                value={filterAula}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams)
                  if (e.target.value) next.set('aula', e.target.value)
                  else next.delete('aula')
                  setSearchParams(next)
                }}
              >
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
              <div className="label">Filtro classe</div>
              <select
                className="select"
                value={filterClasse}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams)
                  if (e.target.value) next.set('classe', e.target.value)
                  else next.delete('classe')
                  setSearchParams(next)
                }}
              >
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
      </div>

      <div className="glass" style={{ padding: 12 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          height="auto"
          nowIndicator
          selectable={canCreate}
          selectMirror
          slotEventOverlap={false}
          displayEventEnd={true}
          eventMaxStack={3}
          dayMaxEventRows={true}
          eventClick={(info) => {
            const booking = info?.event?.extendedProps?.booking
            if (!booking) return
            setSelected({ booking })
          }}
          select={(info) => {
            const start = info.start
            const end = info.end
            setCreatePreset({
              date: toDateStr(start),
              startTime: toTimeStr(start),
              endTime: toTimeStr(end),
            })
            setCreateOpen(true)
          }}
          datesSet={(arg) => setRange({ start: arg.start, end: arg.end })}
          events={events}
          loading={loading}
        />
      </div>

      <BookingModal
        open={createOpen}
        preset={createPreset}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
        filterAulaId={filterAula || null}
      />

      <Modal
        open={Boolean(selected)}
        title="Dettaglio prenotazione"
        onClose={() => setSelected(null)}
        footer={
          selected?.booking && canDeleteBooking({ booking: selected.booking, user }) ? (
            <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setSelected(null)}>
                Chiudi
              </button>
              <button className="btn" style={{ borderColor: 'rgba(255,77,109,0.45)' }} onClick={deleteSelected}>
                Elimina
              </button>
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13 }}>
              Non puoi eliminare questa prenotazione. Se necessario, contatta l’admin.
            </div>
          )
        }
      >
        {selected?.booking ? (
          <div className="formGrid">
            <div>
              <div className="label">Aula</div>
              <div>Aula {selected.booking.aulaNumero ?? selected.booking.aulaId ?? '---'}</div>
            </div>
            <div>
              <div className="label">Docente</div>
              <div>{selected.booking.userName ?? '---'}</div>
            </div>
            <div>
              <div className="label">Data</div>
              <div>{selected.booking.date ?? '---'}</div>
            </div>
            <div>
              <div className="label">Ora inizio</div>
              <div>{selected.booking.startTime ?? '---'}</div>
            </div>
            <div>
              <div className="label">Ora fine</div>
              <div>{selected.booking.endTime ?? '---'}</div>
            </div>
            <div className="full">
              <div className="label">Classi</div>
              <div>{selected.booking.classNames?.length ? selected.booking.classNames.join(', ') : '---'}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

