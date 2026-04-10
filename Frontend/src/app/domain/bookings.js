export function formatIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function normalizeBooking(raw) {
  const id = raw?.id ?? raw?.prenotazione_id ?? raw?._id
  const aulaId = raw?.aula_id ?? raw?.aulaId ?? raw?.aula?.id ?? null
  const aulaNumero = raw?.aula_numero ?? raw?.aulaNumero ?? raw?.aula?.numero ?? raw?.aula?.number ?? null
  const userId = raw?.utente_id ?? raw?.userId ?? raw?.utente?.id ?? raw?.user?.id ?? null
  const userEmail = raw?.utente_email ?? raw?.userEmail ?? raw?.utente?.email ?? raw?.user?.email ?? null
  const date = raw?.data ?? raw?.date ?? null
  const startTime = raw?.ora_inizio ?? raw?.start ?? raw?.oraInizio ?? null
  const endTime = raw?.ora_fine ?? raw?.end ?? raw?.oraFine ?? null
  const classi = raw?.classi ?? raw?.classes ?? raw?.prenotazione_classi ?? []
  const classNames = Array.isArray(classi)
    ? classi.map((c) => c?.nome ?? c?.name ?? c).filter(Boolean)
    : []

  return {
    id,
    aulaId,
    aulaNumero,
    userId,
    userEmail,
    date,
    startTime,
    endTime,
    classNames,
    raw,
  }
}

export function bookingToFullCalendarEvent(b) {
  const titleParts = []
  if (b.aulaNumero != null) titleParts.push(`Aula ${b.aulaNumero}`)
  if (b.classNames?.length) titleParts.push(b.classNames.join(', '))
  const title = titleParts.length ? titleParts.join(' • ') : `Prenotazione ${b.id}`

  const start = b.date && b.startTime ? `${b.date}T${b.startTime}` : null
  const end = b.date && b.endTime ? `${b.date}T${b.endTime}` : null

  return {
    id: String(b.id),
    title,
    start,
    end,
    extendedProps: { booking: b },
  }
}

export function canDeleteBooking({ booking, user }) {
  const role = (user?.ruolo ?? user?.role ?? '').toString().toLowerCase()
  if (role === 'admin' || role === 'amministratore') return true
  const userId = user?.id ?? user?.utente_id
  if (userId != null && booking?.userId != null) return String(userId) === String(booking.userId)
  const email = user?.email
  if (email && booking?.userEmail) return String(email).toLowerCase() === String(booking.userEmail).toLowerCase()
  return false
}

