import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { normalizeBooking } from '../app/domain/bookings.js'
import {
  getSchoolFloorGrid,
  SCHOOL_FLOORS,
  STAIR_SHORT_LABEL,
  STAIR_TINY,
} from '../app/domain/schoolFloors.js'
import { BookingModal } from '../components/BookingModal.jsx'

const CELL_W = 54
const CELL_H = 46
const GAP = 10
const MARGIN = 22
const TITLE_H = 52
const GRID_BOTTOM_PAD = 34

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function floorIndexForRoom(num) {
  const n = Number(num)
  if (!Number.isFinite(n)) return 0
  for (let i = 0; i < SCHOOL_FLOORS.length; i++) {
    const f = SCHOOL_FLOORS[i]
    if (n >= f.roomStart && n <= f.roomEnd) return i
  }
  return 0
}

function floorGradientTint(floorIndex) {
  const t = [
    { free0: '#1a6b5c', free1: '#2dd4bf', busy0: '#8b2940', busy1: '#ff6b8a' },
    { free0: '#2a3a7a', free1: '#5b8def', busy0: '#6b2040', busy1: '#ff7a9a' },
    { free0: '#6b4520', free1: '#e8a45c', busy0: '#7a2830', busy1: '#ff8a9c' },
  ]
  return t[floorIndex] ?? t[0]
}

function buildSvgMetrics(rows, cols) {
  const gridW = cols * CELL_W + (cols - 1) * GAP
  const gridH = rows * CELL_H + (rows - 1) * GAP
  const w = MARGIN * 2 + gridW
  const h = MARGIN * 2 + TITLE_H + gridH + GRID_BOTTOM_PAD
  return { w, h, gridW, gridH }
}

export function Map2DPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [date, setDate] = useState(todayStr())
  const [bookings, setBookings] = useState([])
  const [classi, setClassi] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAula, setSelectedAula] = useState(null)
  const [aulaQuery, setAulaQuery] = useState('')
  const [classQuery, setClassQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [activeFloor, setActiveFloor] = useState(0)
  const [slideDir, setSlideDir] = useState(1)

  const canCreate = useMemo(() => {
    const role = (user?.ruolo ?? user?.role ?? '').toString().toLowerCase()
    return role === 'admin' || role === 'amministratore' || role === 'docente' || role === 'ata'
  }, [user])

  useEffect(() => {
    const raw = searchParams.get('aula')
    if (raw == null || raw === '') return
    const num = Number(raw)
    if (!Number.isFinite(num)) return
    setSelectedAula(num)
    setActiveFloor(floorIndexForRoom(num))
  }, [searchParams])

  async function load() {
    setLoading(true)
    try {
      const classiPromise = classi.length
        ? Promise.resolve(classi)
        : apiFetch('/classi', { token }).then((res) => (Array.isArray(res) ? res : res?.data ?? []))
      const qs = new URLSearchParams()
      qs.set('data', date)
      qs.set('all_bookings', 'true') // Permette ai docenti di vedere tutte le prenotazioni
      const [payload, classiList] = await Promise.all([
        apiFetch(`/prenotazioni?${qs.toString()}`, { token }),
        classiPromise,
      ])
      const list = Array.isArray(payload) ? payload : payload?.data ?? []
      setBookings(list.map(normalizeBooking))
      setClassi(classiList)
    } catch (e) {
      toast.error(e?.message || 'Errore caricamento prenotazioni')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const occupiedSet = useMemo(() => {
    const set = new Set()
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`
    
    for (const b of bookings) {
      const n = b.aulaNumero ?? b.aulaId
      if (n == null) continue
      
      // Controlla se la prenotazione copre l'orario corrente
      if (b.startTime && b.endTime) {
        if (currentTime >= b.startTime && currentTime <= b.endTime) {
          set.add(String(n))
        }
      }
    }
    return set
  }, [bookings])

  const grid = useMemo(() => getSchoolFloorGrid(activeFloor), [activeFloor])
  const metrics = useMemo(
    () => buildSvgMetrics(grid.rows, grid.cols),
    [grid.rows, grid.cols],
  )

  const floorSummary = SCHOOL_FLOORS[activeFloor]
  const allRoomNumbers = useMemo(() => {
    return SCHOOL_FLOORS.flatMap((f) => {
      const out = []
      for (let n = f.roomStart; n <= f.roomEnd; n++) out.push(n)
      return out
    })
  }, [])
  const normalizedAulaQuery = aulaQuery.trim()
  const normalizedClassQuery = classQuery.trim().toLowerCase()
  const classMatchRooms = useMemo(() => {
    if (!normalizedClassQuery) return new Set()
    const matches = new Set()
    for (const booking of bookings) {
      const room = booking.aulaNumero ?? booking.aulaId
      if (room == null) continue
      const names = Array.isArray(booking.classNames) ? booking.classNames : []
      if (names.some((name) => String(name).toLowerCase().includes(normalizedClassQuery))) {
        matches.add(String(room))
      }
    }
    return matches
  }, [bookings, normalizedClassQuery])

  const classSuggestions = useMemo(() => {
    if (!normalizedClassQuery) return []
    const names = classi.map((c) => c?.nome ?? c?.name).filter(Boolean).map(String)
    return names.filter((name) => name.toLowerCase().includes(normalizedClassQuery)).slice(0, 10)
  }, [classi, normalizedClassQuery])

  useEffect(() => {
    if (!classMatchRooms.size) return
    const first = Number(Array.from(classMatchRooms)[0])
    if (!Number.isFinite(first)) return
    setActiveFloor(floorIndexForRoom(first))
  }, [classMatchRooms])

  const busyOnFloor = useMemo(() => {
    return grid.items.filter((it) => occupiedSet.has(String(it.number))).length
  }, [grid.items, occupiedSet])

  function goToFloor(index) {
    if (index === activeFloor) return
    setSlideDir(index > activeFloor ? 1 : -1)
    setActiveFloor(index)
  }

  function roomClass(number) {
    const occupied = occupiedSet.has(String(number))
    const selected = selectedAula === number
    let c = 'map2d-room'
    if (occupied) c += ' map2d-room--busy'
    else c += ' map2d-room--free'
    if (classMatchRooms.has(String(number))) c += ' map2d-room--class-match'
    if (selected) c += ' map2d-room--selected'
    return c
  }

  function onRoomActivate(number) {
    setSelectedAula(number)
    navigate(`/calendario?aula=${number}`, { replace: false })
  }

  function goToRoomFromSearch() {
    const room = Number(normalizedAulaQuery)
    if (!Number.isFinite(room)) return
    const targetFloor = SCHOOL_FLOORS.findIndex((f) => room >= f.roomStart && room <= f.roomEnd)
    if (targetFloor < 0) {
      toast.error('Aula non trovata')
      return
    }
    if (targetFloor !== activeFloor) setSlideDir(targetFloor > activeFloor ? 1 : -1)
    setActiveFloor(targetFloor)
    setSelectedAula(room)
    navigate(`/calendario?aula=${room}`, { replace: false })
  }

  function goToClassFromSearch() {
    const query = classQuery.trim().toLowerCase()
    if (!query) return
    const match = classi.find((c) => String(c?.nome ?? c?.name ?? '').toLowerCase() === query)
      ?? classi.find((c) => String(c?.nome ?? c?.name ?? '').toLowerCase().includes(query))
      ?? classi.find((c) => String(c?.id ?? c?.classe_id ?? '').toLowerCase() === query)

    if (!match) {
      toast.error('Classe non trovata')
      return
    }

    const classId = match?.id ?? match?.classe_id
    if (classId == null) {
      toast.error('Classe non valida')
      return
    }
    navigate(`/calendario?classe=${classId}`, { replace: false })
  }

  const baseY = MARGIN + TITLE_H
  const corridorRow = grid.corridorRow
  const wingLabelY = baseY - 5
  const cx = MARGIN + metrics.gridW / 2

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Mappa scuola (2D)</div>
          <div className="muted">
            Planimetria semplificata: lato alto con classi separate da due scale, corridoio centrale e lato basso con
            tutte le aule in fila unica. Clic su un’aula per il calendario.
          </div>
        </div>
        <div className="toolbarRight">
          {/* Gruppo Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="label">Data</div>
            <input 
              className="input" 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              style={{ width: 160 }}
            />
          </div>

          {/* Gruppo Ricerca Aula */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="label">Cerca aula</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="input"
                list="aule-suggest-header"
                placeholder="es. 53"
                value={aulaQuery}
                onChange={(e) => setAulaQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    goToRoomFromSearch()
                  }
                }}
                style={{ width: 120 }}
              />
              <button className="btn" disabled={!normalizedAulaQuery} onClick={goToRoomFromSearch}>
                Vai
              </button>
              {aulaQuery && (
                <button className="btn" onClick={() => setAulaQuery('')} title="Reset aula">
                  ×
                </button>
              )}
            </div>
            <datalist id="aule-suggest-header">
              {allRoomNumbers.map((n) => (
                <option key={`h-${n}`} value={String(n)} />
              ))}
            </datalist>
          </div>

          {/* Gruppo Ricerca Classe */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="label">Cerca classe</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="input"
                list="classi-suggest-header"
                placeholder="es. 5AIA"
                value={classQuery}
                onChange={(e) => setClassQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    goToClassFromSearch()
                  }
                }}
                style={{ width: 120 }}
              />
              <button className="btn" disabled={!normalizedClassQuery} onClick={goToClassFromSearch}>
                Vai
              </button>
              {classQuery && (
                <button className="btn" onClick={() => setClassQuery('')} title="Reset classe">
                  ×
                </button>
              )}
            </div>
            <datalist id="classi-suggest-header">
              {classSuggestions.map((name) => (
                <option key={`h-${name}`} value={name} />
              ))}
            </datalist>
          </div>

          {/* Gruppo Azioni */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <button className="btn" disabled={loading} onClick={load}>
              Aggiorna
            </button>
            {canCreate && selectedAula ? (
              <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                Prenota {selectedAula}
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="glass map3d-floor-panel" style={{ padding: 12, marginBottom: 12 }}>
        <div className="toolbar" style={{ marginBottom: 10 }}>
          <div className="toolbarLeft">
            <div className="muted" style={{ fontSize: 12 }}>
              Ricerca rapida: classe (es. 5AIA) oppure aula (es. 53).
            </div>
          </div>
          <div className="toolbarRight" />
        </div>
        <div className="map3d-floor-tabs" role="tablist" aria-label="Selezione piano">
          {SCHOOL_FLOORS.map((f, i) => {
            const active = i === activeFloor
            return (
              <motion.button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`btn map3d-floor-tab${active ? ' map3d-floor-tab-active' : ''}`}
                onClick={() => goToFloor(i)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              >
                <span className="map3d-floor-tab-title">{f.label}</span>
                <span className="map3d-floor-tab-meta muted">
                  Aule {f.roomStart}–{f.roomEnd}
                </span>
              </motion.button>
            )
          })}
        </div>
        <div className="map2d-legend" style={{ marginTop: 12 }}>
          <span className="map2d-legend-item">
            <span className="map2d-swatch map2d-swatch--free" /> Libera
          </span>
          <span className="map2d-legend-item">
            <span className="map2d-swatch map2d-swatch--busy" /> Occupata (in questa data)
          </span>
          <span className="map2d-legend-item">
            <span className="map2d-swatch map2d-swatch--selected" /> Selezionata
          </span>
          <span className="map2d-legend-item muted" style={{ fontSize: 12 }}>
            <span className="map2d-swatch map2d-swatch--void" /> Vuoti
          </span>
          <span className="map2d-legend-item muted" style={{ fontSize: 12 }}>
            <span className="map2d-swatch map2d-swatch--stair" /> Scale
          </span>
          <span className="map2d-legend-item muted" style={{ fontSize: 12 }}>
            <span className="map2d-swatch map2d-swatch--class-match" /> Trovata per classe
          </span>
          <span className="muted" style={{ fontSize: 12, marginLeft: 'auto' }}>
            {busyOnFloor} occupate su {grid.count} in {floorSummary.label}
          </span>
        </div>
      </div>

      <div className="glass map2d-wrap" style={{ padding: 16 }}>
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.svg
            key={activeFloor}
            className="map2d-svg"
            viewBox={`0 0 ${metrics.w} ${metrics.h}`}
            role="img"
            aria-label={`Planimetria ${floorSummary.label}`}
            custom={slideDir}
            initial={(dir) => ({ opacity: 0, x: dir * 28, filter: 'blur(5px)' })}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={(dir) => ({ opacity: 0, x: dir * -18, filter: 'blur(4px)' })}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <defs>
              <filter id={`map2d-glow-${activeFloor}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={`map2d-soft-${activeFloor}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
              </filter>
              <linearGradient id={`map2d-building-${activeFloor}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(22, 26, 48, 0.92)" />
                <stop offset="100%" stopColor="rgba(10, 12, 28, 0.88)" />
              </linearGradient>
              {(() => {
                const g = floorGradientTint(activeFloor)
                return (
                  <>
                    <linearGradient id={`map2d-free-${activeFloor}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={g.free0} stopOpacity="0.55" />
                      <stop offset="100%" stopColor={g.free1} stopOpacity="0.38" />
                    </linearGradient>
                    <linearGradient id={`map2d-busy-${activeFloor}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={g.busy0} stopOpacity="0.65" />
                      <stop offset="100%" stopColor={g.busy1} stopOpacity="0.45" />
                    </linearGradient>
                  </>
                )
              })()}
            </defs>

            <rect
              x={4}
              y={4}
              width={metrics.w - 8}
              height={metrics.h - 8}
              rx={18}
              fill={`url(#map2d-building-${activeFloor})`}
              stroke="rgba(180, 160, 255, 0.28)"
              strokeWidth={1.5}
            />

            <text x={metrics.w / 2} y={MARGIN + 19} textAnchor="middle" className="map2d-floor-title">
              {floorSummary.label}
            </text>
            <text x={metrics.w / 2} y={MARGIN + 36} textAnchor="middle" className="map2d-floor-subtitle">
              {floorSummary.buildingNote ?? 'Istituto'} · aule {floorSummary.roomStart}–{floorSummary.roomEnd}
            </text>

            <text x={cx} y={wingLabelY} textAnchor="middle" className="map2d-wing-label">
              Nord - classi e due collegamenti verticali
            </text>

            {corridorRow != null ? (
              <>
                <rect
                  x={MARGIN - 2}
                  y={baseY + corridorRow * (CELL_H + GAP) - 2}
                  width={metrics.gridW + 4}
                  height={CELL_H + 4}
                  rx={10}
                  className="map2d-corridor-band"
                />
                <line
                  x1={MARGIN + 10}
                  y1={baseY + corridorRow * (CELL_H + GAP) + (CELL_H + 4) / 2}
                  x2={MARGIN + metrics.gridW - 10}
                  y2={baseY + corridorRow * (CELL_H + GAP) + (CELL_H + 4) / 2}
                  className="map2d-corridor-line"
                />
                <text
                  x={cx}
                  y={baseY + corridorRow * (CELL_H + GAP) + (CELL_H + 4) / 2 + 4}
                  textAnchor="middle"
                  className="map2d-corridor-label"
                >
                  Corridoio principale
                </text>
              </>
            ) : null}

            <text
              x={cx}
              y={baseY + (grid.rows - 1) * (CELL_H + GAP) + CELL_H + 14}
              textAnchor="middle"
              className="map2d-wing-label map2d-wing-label--south"
            >
              Sud - fila unica di aule
            </text>

            {grid.cells.map((cell) => {
              const x = MARGIN + cell.col * (CELL_W + GAP)
              const y = baseY + cell.row * (CELL_H + GAP)
              if (cell.kind === 'void') {
                return (
                  <rect
                    key={`v-${cell.row}-${cell.col}`}
                    x={x}
                    y={y}
                    width={CELL_W}
                    height={CELL_H}
                    rx={9}
                    className="map2d-void"
                  />
                )
              }
              if (cell.kind === 'stair' && cell.stairId) {
                const label = STAIR_TINY[cell.stairId] ?? cell.stairId
                return (
                  <g key={`s-${cell.row}-${cell.col}`}>
                    <title>{STAIR_SHORT_LABEL[cell.stairId] ?? cell.stairId}</title>
                    <rect x={x} y={y} width={CELL_W} height={CELL_H} rx={8} className="map2d-stair" />
                    <text
                      x={x + CELL_W / 2}
                      y={y + CELL_H / 2 + 4}
                      textAnchor="middle"
                      className="map2d-stair-label"
                    >
                      {label}
                    </text>
                  </g>
                )
              }
              const number = cell.number
              if (number == null) return null
              const selected = selectedAula === number
              const busy = occupiedSet.has(String(number))
              return (
                <g
                  key={number}
                  role="button"
                  tabIndex={0}
                  className="map2d-room-hit"
                  onClick={() => onRoomActivate(number)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onRoomActivate(number)
                    }
                  }}
                  aria-label={`Aula ${number}${busy ? ', occupata' : ', libera'}${selected ? ', selezionata' : ''}`}
                >
                  <rect
                    x={x}
                    y={y}
                    width={CELL_W}
                    height={CELL_H}
                    rx={10}
                    className={roomClass(number)}
                    fill={busy ? `url(#map2d-busy-${activeFloor})` : `url(#map2d-free-${activeFloor})`}
                    filter={selected ? `url(#map2d-glow-${activeFloor})` : `url(#map2d-soft-${activeFloor})`}
                  />
                  <text
                    x={x + CELL_W / 2}
                    y={y + CELL_H / 2 + 6}
                    textAnchor="middle"
                    className="map2d-room-label"
                    pointerEvents="none"
                  >
                    {number}
                  </text>
                </g>
              )
            })}
          </motion.svg>
        </AnimatePresence>
      </div>

      <div className="glass" style={{ padding: 12 }}>
        <div className="toolbar">
          <div className="toolbarLeft">
            <div className="muted" style={{ fontSize: 13 }}>
              Selezione: {selectedAula ? `Aula ${selectedAula}` : '—'} ·{' '}
              <span className="muted">URL: </span>
              <code style={{ fontSize: 12 }}>/mappa-scuola?aula=</code>
              <span className="muted" style={{ fontSize: 12 }}>
                {' '}
                (numero)
              </span>
            </div>
          </div>
          <div className="toolbarRight">
            {selectedAula ? (
              <button className="btn" onClick={() => setSelectedAula(null)}>
                Deseleziona
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <BookingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
        preset={{ date, aulaId: selectedAula }}
        filterAulaId={selectedAula}
      />
    </div>
  )
}
