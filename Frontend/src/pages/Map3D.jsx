import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { normalizeBooking } from '../app/domain/bookings.js'
import { getSchoolFloorLayout3d, SCHOOL_FLOORS } from '../app/domain/schoolFloors.js'
import { BookingModal } from '../components/BookingModal.jsx'

/** Celle più larghe per dare spazio al profilo “aula” (rettangolare, pareti basse). */
const ROOM_SPACING = 1.12

/** Dimensioni stilizzate da aula scolastica (vista dall’alto: corridoio sul lato +Z). */
const CLASS = {
  width: 0.9,
  depth: 0.7,
  wallH: 0.38,
  wallT: 0.04,
  floorT: 0.045,
  doorW: 0.22,
  doorH: 0.3,
}

function setGroupOpacity(root, opacity) {
  if (!root) return
  root.traverse((obj) => {
    if (obj.isMesh && obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const m of mats) {
        m.transparent = opacity < 1
        m.opacity = opacity
        m.needsUpdate = true
      }
    }
  })
}

function FloorLevel({
  floorIndex,
  slideDir,
  occupiedSet,
  onRoomClick,
}) {
  const layout = useMemo(() => getSchoolFloorLayout3d(floorIndex, ROOM_SPACING), [floorIndex])
  const config = layout.config

  const rootRef = useRef(null)
  const roomsRef = useRef(null)
  const animatingRef = useRef(false)
  const startTimeRef = useRef(0)
  const fromYRef = useRef(0)
  const firstPaintRef = useRef(true)

  useLayoutEffect(() => {
    if (firstPaintRef.current) {
      firstPaintRef.current = false
      if (roomsRef.current) {
        roomsRef.current.position.y = 0
        setGroupOpacity(roomsRef.current, 1)
      }
      return
    }
    animatingRef.current = true
    startTimeRef.current = performance.now()
    fromYRef.current = slideDir >= 0 ? 2.1 : -2.1
    if (roomsRef.current) {
      roomsRef.current.position.y = fromYRef.current
      setGroupOpacity(roomsRef.current, 0.15)
    }
  }, [floorIndex, slideDir])

  useFrame(() => {
    const g = roomsRef.current
    if (!g || !animatingRef.current) return
    const elapsed = performance.now() - startTimeRef.current
    const duration = 520
    const t = Math.min(1, elapsed / duration)
    const ease = 1 - (1 - t) ** 3
    g.position.y = fromYRef.current * (1 - ease)
    setGroupOpacity(g, 0.15 + (1 - 0.15) * ease)
    if (t >= 1) {
      animatingRef.current = false
      g.position.y = 0
      setGroupOpacity(g, 1)
    }
  })

  return (
    <group ref={rootRef} position={[-layout.centerX, 0, -layout.centerZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[layout.centerX, -0.18, layout.centerZ]}>
        <planeGeometry args={[layout.width, layout.depth]} />
        <meshStandardMaterial
          color={config.plateColor}
          emissive={config.plateEmissive}
          emissiveIntensity={0.35}
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>
      <group ref={roomsRef}>
        {layout.items.map((r) => (
          <ClassroomRoom
            key={r.number}
            number={r.number}
            occupied={occupiedSet.has(String(r.number))}
            position={r.position}
            onClick={(e) => {
              e.stopPropagation()
              onRoomClick(r.number)
            }}
          />
        ))}
      </group>
    </group>
  )
}

function ClassroomRoom({ number, occupied, onClick, position }) {
  const { width: W, depth: D, wallH: H, wallT: t, floorT, doorW, doorH } = CLASS
  const baseY = floorT / 2
  const wallCenterY = baseY + H / 2
  const halfW = W / 2
  const halfD = D / 2

  const floorColor = occupied ? '#c94d68' : '#4a9e8a'
  const floorEmissive = occupied ? '#5c1024' : '#083028'
  const wallColor = '#c8c4b8'
  const wallRough = 0.72
  const ceilingY = baseY + H + 0.02

  const frontZ = halfD - t / 2
  const wingW = (W - doorW) / 2 - t

  return (
    <group position={position} onClick={onClick}>
      {/* Pavimento (linoleum: verde libero / rosato occupato) */}
      <mesh position={[0, baseY, 0]}>
        <boxGeometry args={[W - 0.02, floorT, D - 0.02]} />
        <meshStandardMaterial
          color={floorColor}
          emissive={floorEmissive}
          emissiveIntensity={occupied ? 0.35 : 0.22}
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Parete fondo con lavagna + finestre (tipico lato corto aula) */}
      <mesh position={[0, wallCenterY, -halfD + t / 2]}>
        <boxGeometry args={[W, H, t]} />
        <meshStandardMaterial color={wallColor} roughness={wallRough} metalness={0.02} transparent opacity={1} />
      </mesh>
      <mesh position={[0, baseY + H * 0.52, -halfD + t + 0.015]}>
        <boxGeometry args={[W * 0.48, H * 0.32, 0.02]} />
        <meshStandardMaterial color="#1e4a38" emissive="#0a2218" emissiveIntensity={0.15} roughness={0.9} />
      </mesh>
      <mesh position={[-W * 0.28, baseY + H * 0.78, -halfD + t + 0.012]}>
        <boxGeometry args={[W * 0.18, H * 0.22, 0.015]} />
        <meshStandardMaterial
          color="#8ec5e8"
          emissive="#b8e8ff"
          emissiveIntensity={0.85}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[W * 0.28, baseY + H * 0.78, -halfD + t + 0.012]}>
        <boxGeometry args={[W * 0.18, H * 0.22, 0.015]} />
        <meshStandardMaterial
          color="#8ec5e8"
          emissive="#b8e8ff"
          emissiveIntensity={0.85}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Pareti laterali */}
      <mesh position={[-halfW + t / 2, wallCenterY, 0]}>
        <boxGeometry args={[t, H, D - 2 * t]} />
        <meshStandardMaterial color={wallColor} roughness={wallRough} metalness={0.02} transparent opacity={1} />
      </mesh>
      <mesh position={[halfW - t / 2, wallCenterY, 0]}>
        <boxGeometry args={[t, H, D - 2 * t]} />
        <meshStandardMaterial color={wallColor} roughness={wallRough} metalness={0.02} transparent opacity={1} />
      </mesh>

      {/* Corridoio: due spezzoni di parete e porta centrale */}
      {wingW > 0.04 ? (
        <>
          <mesh position={[-halfW + wingW / 2 + t / 2, wallCenterY, frontZ]}>
            <boxGeometry args={[wingW, H, t]} />
            <meshStandardMaterial color={wallColor} roughness={wallRough} metalness={0.02} transparent opacity={1} />
          </mesh>
          <mesh position={[halfW - wingW / 2 - t / 2, wallCenterY, frontZ]}>
            <boxGeometry args={[wingW, H, t]} />
            <meshStandardMaterial color={wallColor} roughness={wallRough} metalness={0.02} transparent opacity={1} />
          </mesh>
        </>
      ) : null}
      <mesh position={[0, baseY + doorH / 2, halfD - t * 0.6]}>
        <boxGeometry args={[doorW * 0.92, doorH, t * 0.9]} />
        <meshStandardMaterial color="#6b4423" emissive="#2a1508" emissiveIntensity={0.08} roughness={0.65} />
      </mesh>

      {/* Soffitto leggero (chiude il volume come stanza) */}
      <mesh position={[0, ceilingY, 0]}>
        <boxGeometry args={[W - 0.04, 0.028, D - 0.04]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.88} metalness={0} transparent opacity={1} />
      </mesh>

      {/* Due file di banchi stilizzati */}
      <mesh position={[0, baseY + 0.035, -D * 0.08]}>
        <boxGeometry args={[W * 0.62, 0.03, D * 0.12]} />
        <meshStandardMaterial color="#3d4555" roughness={0.6} metalness={0.12} />
      </mesh>
      <mesh position={[0, baseY + 0.035, D * 0.06]}>
        <boxGeometry args={[W * 0.62, 0.03, D * 0.12]} />
        <meshStandardMaterial color="#3d4555" roughness={0.6} metalness={0.12} />
      </mesh>

      <Text
        position={[0, ceilingY + 0.16, 0]}
        fontSize={0.16}
        color="#f5f7ff"
        anchorX="center"
        anchorY="bottom"
      >
        {number}
      </Text>
    </group>
  )
}

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function Map3DPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [date, setDate] = useState(todayStr())
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAula, setSelectedAula] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [activeFloor, setActiveFloor] = useState(0)
  const [slideDir, setSlideDir] = useState(1)

  const canCreate = useMemo(() => {
    const role = (user?.ruolo ?? user?.role ?? '').toString().toLowerCase()
    return role === 'admin' || role === 'amministratore' || role === 'docente' || role === 'ata'
  }, [user])

  async function load() {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      qs.set('data', date)
      const payload = await apiFetch(`/prenotazioni?${qs.toString()}`, { token })
      const list = Array.isArray(payload) ? payload : payload?.data ?? []
      setBookings(list.map(normalizeBooking))
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
    for (const b of bookings) {
      const n = b.aulaNumero ?? b.aulaId
      if (n != null) set.add(String(n))
    }
    return set
  }, [bookings])

  const floorSummary = SCHOOL_FLOORS[activeFloor]
  const roomsOnFloor = floorSummary.roomEnd - floorSummary.roomStart + 1

  function goToFloor(index) {
    if (index === activeFloor) return
    setSlideDir(index > activeFloor ? 1 : -1)
    setActiveFloor(index)
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Mappa 3D</div>
          <div className="muted">
            Tre piani: {SCHOOL_FLOORS.map((f) => f.label).join(' · ')}. Verde = libera, rossa = occupata. Clicca un’aula per
            il calendario.
          </div>
        </div>
        <div className="toolbarRight">
          <div style={{ minWidth: 180 }}>
            <div className="label">Data</div>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button className="btn" disabled={loading} onClick={load}>
            Aggiorna
          </button>
          {canCreate && selectedAula ? (
            <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
              Prenota Aula {selectedAula}
            </button>
          ) : null}
        </div>
      </header>

      <motion.div
        className="glass map3d-floor-panel"
        style={{ padding: 12, marginBottom: 12 }}
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
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
        <motion.div
          key={activeFloor}
          className="muted"
          style={{ fontSize: 13, marginTop: 8 }}
          initial={{ opacity: 0, x: slideDir * 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Piano attuale: <strong style={{ color: 'var(--text)' }}>{floorSummary.label}</strong> — {roomsOnFloor} aule
          in questa vista.
        </motion.div>
      </motion.div>

      <motion.div
        className="glass"
        style={{ padding: 12, height: '72svh', minHeight: 460, overflow: 'hidden' }}
        key={activeFloor}
        initial={{ opacity: 0.88, scale: 0.992 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 14, 8]} intensity={0.95} />
          <FloorLevel
            floorIndex={activeFloor}
            slideDir={slideDir}
            occupiedSet={occupiedSet}
            onRoomClick={(num) => {
              setSelectedAula(num)
              navigate(`/calendario?aula=${num}`)
            }}
          />
          <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.05} />
        </Canvas>
      </motion.div>

      <div className="glass" style={{ padding: 12 }}>
        <div className="toolbar">
          <div className="toolbarLeft">
            <div className="muted" style={{ fontSize: 13 }}>
              Selezione: {selectedAula ? `Aula ${selectedAula}` : '—'}
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
