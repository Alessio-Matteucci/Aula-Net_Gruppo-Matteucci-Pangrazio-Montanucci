import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../app/api/client.js'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { normalizeBooking } from '../app/domain/bookings.js'
import { BookingModal } from '../components/BookingModal.jsx'

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function BoxRoom({ number, occupied, onClick, position }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <boxGeometry args={[0.9, 0.25, 0.9]} />
        <meshStandardMaterial
          color={occupied ? '#ff4d6d' : '#2dd4bf'}
          emissive={occupied ? '#7a1226' : '#0b3b34'}
          emissiveIntensity={0.7}
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>
      <Text
        position={[0, 0.22, 0]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
      >
        {number}
      </Text>
    </group>
  )
}

export function Map3DPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [date, setDate] = useState(todayStr())
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAula, setSelectedAula] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)

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

  const rooms = useMemo(() => {
    const items = []
    const cols = 17
    for (let i = 1; i <= 119; i++) {
      const idx = i - 1
      const x = (idx % cols) * 1.05
      const z = Math.floor(idx / cols) * 1.05
      items.push({
        number: i,
        position: [x, 0, z],
        occupied: occupiedSet.has(String(i)),
      })
    }
    const centerX = ((cols - 1) * 1.05) / 2
    const rows = Math.ceil(119 / cols)
    const centerZ = ((rows - 1) * 1.05) / 2
    return { items, centerX, centerZ }
  }, [occupiedSet])

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Mappa 3D</div>
          <div className="muted">
            Verde = libera, Rosso = occupata. Clicca un’aula per aprire il calendario filtrato.
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

      <div className="glass" style={{ padding: 12, height: '72svh', minHeight: 460 }}>
        <Canvas camera={{ position: [0, 8, 12], fov: 55 }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[10, 12, 6]} intensity={0.9} />
          <group position={[-rooms.centerX, 0, -rooms.centerZ]}>
            {rooms.items.map((r) => (
              <BoxRoom
                key={r.number}
                number={r.number}
                occupied={r.occupied}
                position={r.position}
                onClick={() => {
                  setSelectedAula(r.number)
                  navigate(`/calendario?aula=${r.number}`)
                }}
              />
            ))}
          </group>
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>
      </div>

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

