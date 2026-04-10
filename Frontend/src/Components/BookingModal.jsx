import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from './Modal.jsx'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { formatIsoDate } from '../app/domain/bookings.js'

function timeToMinutes(t) {
  const [hh, mm] = String(t || '').split(':').map((x) => Number(x))
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  return hh * 60 + mm
}

export function BookingModal({
  open,
  onClose,
  onCreated,
  preset,
  filterAulaId,
}) {
  const { token, user } = useAuth()
  const [aule, setAule] = useState([])
  const [classi, setClassi] = useState([])
  const [loading, setLoading] = useState(false)

  const [aulaId, setAulaId] = useState('')
  const [date, setDate] = useState(formatIsoDate(new Date()))
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('09:00')
  const [selectedClasses, setSelectedClasses] = useState([])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    async function load() {
      try {
        const [auleRes, classiRes] = await Promise.all([
          apiFetch('/aule', { token }),
          apiFetch('/classi', { token }),
        ])
        if (cancelled) return
        setAule(Array.isArray(auleRes) ? auleRes : auleRes?.data ?? [])
        setClassi(Array.isArray(classiRes) ? classiRes : classiRes?.data ?? [])
      } catch (e) {
        toast.error(e?.message || 'Errore nel caricamento dati')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [open, token])

  useEffect(() => {
    if (!open) return
    if (preset?.date) setDate(preset.date)
    if (preset?.startTime) setStartTime(preset.startTime)
    if (preset?.endTime) setEndTime(preset.endTime)
    if (preset?.aulaId != null) setAulaId(String(preset.aulaId))
    else if (filterAulaId != null) setAulaId(String(filterAulaId))
  }, [open, preset, filterAulaId])

  const canCreate = useMemo(() => {
    const role = (user?.ruolo ?? user?.role ?? '').toString().toLowerCase()
    return role === 'admin' || role === 'amministratore' || role === 'docente' || role === 'ata'
  }, [user])

  async function submit() {
    if (!canCreate) {
      toast.error('Non hai i permessi per creare prenotazioni')
      return
    }
    if (!aulaId) {
      toast.error('Seleziona un’aula')
      return
    }
    const s = timeToMinutes(startTime)
    const e = timeToMinutes(endTime)
    if (s == null || e == null || e <= s) {
      toast.error('Orario non valido')
      return
    }
    if (!selectedClasses.length) {
      toast.error('Seleziona almeno una classe')
      return
    }

    setLoading(true)
    try {
      await apiFetch('/prenotazioni', {
        method: 'POST',
        token,
        json: {
          aula_id: Number(aulaId),
          data: date,
          ora_inizio: startTime,
          ora_fine: endTime,
          classi: selectedClasses.map(Number),
        },
      })
      toast.success('Prenotazione creata')
      onCreated?.()
      onClose?.()
    } catch (e) {
      toast.error(e?.message || 'Errore creazione prenotazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Nuova prenotazione"
      onClose={loading ? undefined : onClose}
      footer={
        <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" disabled={loading} onClick={onClose}>
            Annulla
          </button>
          <button className="btn btn-primary" disabled={loading} onClick={submit}>
            Crea
          </button>
        </div>
      }
    >
      <div className="formGrid">
        <div className="full">
          <div className="label">Aula</div>
          <select className="select" value={aulaId} onChange={(e) => setAulaId(e.target.value)}>
            <option value="">Seleziona…</option>
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

        <div>
          <div className="label">Data</div>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div />

        <div>
          <div className="label">Ora inizio</div>
          <input className="input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <div className="label">Ora fine</div>
          <input className="input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div className="full">
          <div className="label">Classi coinvolte (multi-selezione)</div>
          <select
            className="select"
            multiple
            value={selectedClasses.map(String)}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map((o) => o.value)
              setSelectedClasses(values)
            }}
            style={{ minHeight: 120 }}
          >
            {classi.map((c) => {
              const id = c?.id ?? c?.classe_id
              const name = c?.nome ?? c?.name ?? c?.classe ?? `Classe ${id}`
              return (
                <option key={String(id)} value={String(id)}>
                  {name}
                </option>
              )
            })}
          </select>
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            Suggerimento: tieni premuto Ctrl (Windows) per selezionare più classi.
          </div>
        </div>
      </div>
    </Modal>
  )
}

