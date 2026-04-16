import { useState, useEffect } from 'react'
import { useAuth } from '../app/auth/AuthProvider.jsx'
import { apiFetch } from '../app/api/client.js'
import toast from 'react-hot-toast'
import PacManGame from '../Components/PacManGame.jsx'

export default function UserManagement() {
  const { user, token } = useAuth()
  const [utenti, setUtenti] = useState([])
  const [classi, setClassi] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [creatingUser, setCreatingUser] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showPacMan, setShowPacMan] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    ruolo: 'studente',
    classe_id: ''
  })

  useEffect(() => {
    console.log('UserManagement mounted, user:', user)
    if (user) {
      loadUtenti()
      loadClassi()
    }
  }, [user])

  async function loadUtenti() {
    setLoading(true)
    setError(null)
    try {
      console.log('Loading utenti...', 'token:', token ? 'present' : 'missing')
      const data = await apiFetch('/utenti', { token })
      console.log('Utenti loaded:', data)
      setUtenti(data)
    } catch (error) {
      console.error('Error loading utenti:', error)
      setError(error.message || 'Errore nel caricamento degli utenti')
      toast.error(error.message || 'Errore nel caricamento degli utenti')
    } finally {
      setLoading(false)
    }
  }

  async function loadClassi() {
    try {
      const data = await apiFetch('/classi', { token })
      setClassi(data)
    } catch (error) {
      toast.error('Errore nel caricamento delle classi')
    }
  }

  function startEdit(utente) {
    setEditingUser(utente)
    setFormData({
      nome: utente.nome,
      cognome: utente.cognome,
      email: utente.email,
      ruolo: utente.ruolo,
      classe_id: utente.classe_id || ''
    })
  }

  function cancelEdit() {
    setEditingUser(null)
    setCreatingUser(false)
    setFormErrors({})
    setFormData({
      nome: '',
      cognome: '',
      email: '',
      ruolo: 'studente',
      classe_id: ''
    })
  }

  function startCreate() {
    setEditingUser(null)
    setCreatingUser(true)
    setFormErrors({})
    setFormData({
      nome: '',
      cognome: '',
      email: '',
      ruolo: 'studente',
      classe_id: ''
    })
  }

  async function handleCreate(e) {
    e.preventDefault()
    
    const errors = validateForm(formData)
    setFormErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    try {
      const payload = { ...formData }
      if (payload.ruolo !== 'studente') {
        payload.classe_id = null
      }

      await apiFetch('/utenti', {
        method: 'POST',
        token,
        json: payload
      })

      toast.success('Utente creato con successo')
      cancelEdit()
      loadUtenti()
    } catch (error) {
      toast.error(error.message || 'Errore nella creazione')
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    
    if (!editingUser) return

    const errors = validateForm(formData)
    setFormErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      const payload = { ...formData }
      if (payload.ruolo !== 'studente') {
        payload.classe_id = null
      }

      await apiFetch(`/utenti/${editingUser.id}`, {
        method: 'PUT',
        token,
        json: payload
      })

      toast.success('Utente aggiornato con successo')
      cancelEdit()
      loadUtenti()
    } catch (error) {
      toast.error(error.message || 'Errore nell\'aggiornamento')
    }
  }

  async function handleDelete(utente) {
    if (!confirm(`Sei sicuro di voler eliminare l'utente "${utente.nome} ${utente.cognome}"?`)) {
      return
    }

    try {
      await apiFetch(`/utenti/${utente.id}`, { method: 'DELETE', token })
      toast.success('Utente eliminato con successo')
      loadUtenti()
    } catch (error) {
      toast.error(error.message || 'Errore nell\'eliminazione')
    }
  }

  function validateForm(data) {
    const errors = {}
    
    // Validazione nome: solo lettere, spazi, non vuoto
    if (!data.nome || data.nome.trim() === '') {
      errors.nome = 'Il nome è obbligatorio'
    } else if (!/^[a-zA-Z\sÀ-ÿ]+$/.test(data.nome.trim())) {
      errors.nome = 'Il nome può contenere solo lettere'
    }
    
    // Validazione cognome: solo lettere, spazi, non vuoto
    if (!data.cognome || data.cognome.trim() === '') {
      errors.cognome = 'Il cognome è obbligatorio'
    } else if (!/^[a-zA-Z\sÀ-ÿ]+$/.test(data.cognome.trim())) {
      errors.cognome = 'Il cognome può contenere solo lettere'
    }
    
    // Validazione email
    if (!data.email || data.email.trim() === '') {
      errors.email = 'L\'email è obbligatoria'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Email non valida'
    }
    
    // Validazione classe per studenti
    if (data.ruolo === 'studente' && (!data.classe_id || data.classe_id === '')) {
      errors.classe_id = 'La classe è obbligatoria per gli studenti'
    }
    
    return errors
  }

  function getRuoloColor(ruolo) {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      docente: 'bg-blue-100 text-blue-800',
      ata: 'bg-green-100 text-green-800',
      studente: 'bg-gray-100 text-gray-800'
    }
    return colors[ruolo] || 'bg-gray-100 text-gray-800'
  }

  if (error) {
    return (
      <div className="page">
        <div className="glass" style={{ padding: 20, textAlign: 'center', color: '#ef4444' }}>
          <h3>Errore</h3>
          <p>{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Ricarica
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="glass" style={{ padding: 20, textAlign: 'center' }}>
          Caricamento...
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="pageTitle">Gestione Utenti</div>
          <div className="muted">
            Gestione completa di tutti i profili utente del sistema
          </div>
        </div>
      </header>

      <div className="glass" style={{ padding: 20 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Utenti Registrati ({utenti.length})</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={startCreate} disabled={loading || creatingUser}>
              Crea Nuovo Utente
            </button>
            <button className="btn" onClick={loadUtenti} disabled={loading}>
              Aggiorna
            </button>
            <button 
              className="btn" 
              onClick={() => setShowPacMan(true)}
              style={{ backgroundColor: '#FFD700', color: '#000', fontWeight: 'bold' }}
              title="Gioca a Pac-Man!"
            >
              🎮 Pac-Man
            </button>
          </div>
        </div>

        {creatingUser && (
          <div className="glass" style={{ padding: 20, marginBottom: 20, border: '2px solid #10b981' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Crea Nuovo Utente</h4>
            <form onSubmit={handleCreate}>
              <div className="formGrid">
                <div>
                  <div className="label">Nome</div>
                  <input
                    className={`input ${formErrors.nome ? 'error' : ''}`}
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                  {formErrors.nome && (
                    <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                      {formErrors.nome}
                    </div>
                  )}
                </div>
                <div>
                  <div className="label">Cognome</div>
                  <input
                    className={`input ${formErrors.cognome ? 'error' : ''}`}
                    value={formData.cognome}
                    onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                    required
                  />
                  {formErrors.cognome && (
                    <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                      {formErrors.cognome}
                    </div>
                  )}
                </div>
                <div>
                  <div className="label">Email</div>
                  <input
                    className={`input ${formErrors.email ? 'error' : ''}`}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {formErrors.email && (
                    <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                      {formErrors.email}
                    </div>
                  )}
                </div>
                <div>
                  <div className="label">Ruolo</div>
                  <select
                    className="input"
                    value={formData.ruolo}
                    onChange={(e) => setFormData({ ...formData, ruolo: e.target.value, classe_id: '' })}
                  >
                    <option value="studente">Studente</option>
                    <option value="docente">Docente</option>
                    <option value="ata">ATA</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {formData.ruolo === 'studente' && (
                  <div>
                    <div className="label">Classe *</div>
                    <select
                      className={`input ${formErrors.classe_id ? 'error' : ''}`}
                      value={formData.classe_id}
                      onChange={(e) => setFormData({ ...formData, classe_id: e.target.value })}
                    >
                      <option value="">Seleziona classe</option>
                      {classi.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                          {classe.nome}
                        </option>
                      ))}
                    </select>
                    {formErrors.classe_id && (
                      <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                        {formErrors.classe_id}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">
                  Crea Utente
                </button>
                <button type="button" className="btn" onClick={cancelEdit}>
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {editingUser && (
          <div className="glass" style={{ padding: 20, marginBottom: 20, border: '2px solid #3b82f6' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>Modifica Utente: {editingUser.nome} {editingUser.cognome}</h4>
            <form onSubmit={handleSave}>
              <div className="formGrid">
                <div>
                  <div className="label">Nome</div>
                  <input
                    className="input"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <div className="label">Cognome</div>
                  <input
                    className="input"
                    value={formData.cognome}
                    onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <div className="label">Email</div>
                  <input
                    className="input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <div className="label">Ruolo</div>
                  <select
                    className="input"
                    value={formData.ruolo}
                    onChange={(e) => setFormData({ ...formData, ruolo: e.target.value, classe_id: '' })}
                  >
                    <option value="studente">Studente</option>
                    <option value="docente">Docente</option>
                    <option value="ata">ATA</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {formData.ruolo === 'studente' && (
                  <div>
                    <div className="label">Classe *</div>
                    <select
                      className={`input ${formErrors.classe_id ? 'error' : ''}`}
                      value={formData.classe_id}
                      onChange={(e) => setFormData({ ...formData, classe_id: e.target.value })}
                    >
                      <option value="">Seleziona classe</option>
                      {classi.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                          {classe.nome}
                        </option>
                      ))}
                    </select>
                    {formErrors.classe_id && (
                      <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                        {formErrors.classe_id}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">
                  Salva Modifiche
                </button>
                <button type="button" className="btn" onClick={cancelEdit}>
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Utente</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Ruolo</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Classe</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Creato il</th>
                <th style={{ padding: 12, textAlign: 'center' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {utenti.map((utente) => (
                <tr key={utente.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 500 }}>
                      {utente.nome} {utente.cognome}
                    </div>
                    {utente.id === user?.id && (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Tu</div>
                    )}
                  </td>
                  <td style={{ padding: 12 }}>{utente.email}</td>
                  <td style={{ padding: 12 }}>
                    <span className={`badge ${getRuoloColor(utente.ruolo)}`} style={{ padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                      {utente.ruolo.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    {utente.classe_nome || '-'}
                  </td>
                  <td style={{ padding: 12, fontSize: 14, color: '#6b7280' }}>
                    {new Date(utente.created_at).toLocaleDateString('it-IT')}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        className="btn"
                        onClick={() => startEdit(utente)}
                        disabled={editingUser?.id === utente.id}
                        style={{ padding: '4px 8px', fontSize: 12 }}
                      >
                        Modifica
                      </button>
                      {utente.id !== user?.id && (
                        <button
                          className="btn"
                          onClick={() => handleDelete(utente)}
                          style={{ padding: '4px 8px', fontSize: 12, backgroundColor: '#ef4444', color: 'white' }}
                        >
                          Elimina
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {utenti.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            Nessun utente trovato
          </div>
        )}
      </div>

      {/* Modal Pac-Man */}
      {showPacMan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#1a1a2e',
            borderRadius: 12,
            padding: 20,
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <button 
              onClick={() => setShowPacMan(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#fff'
              }}
            >
              ×
            </button>
            <PacManGame />
          </div>
        </div>
      )}
    </div>
  )
}
