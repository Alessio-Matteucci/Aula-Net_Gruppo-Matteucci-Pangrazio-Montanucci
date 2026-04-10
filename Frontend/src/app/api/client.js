const DEFAULT_BASE_URL = 'http://localhost:3000'

export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (!raw || typeof raw !== 'string') return DEFAULT_BASE_URL
  return raw.replace(/\/+$/, '')
}

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function readJsonSafe(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

export async function apiFetch(path, { method = 'GET', token, json, headers } = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`
  const res = await fetch(url, {
    method,
    headers: {
      ...(json ? { 'Content-Type': 'application/json' } : null),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
      ...headers,
    },
    body: json ? JSON.stringify(json) : undefined,
  })

  const payload = await readJsonSafe(res)
  if (!res.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Richiesta fallita (${res.status})`
    throw new ApiError(message, { status: res.status, payload })
  }
  return payload
}

