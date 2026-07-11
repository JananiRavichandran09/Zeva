const BASE = import.meta.env.VITE_API_URL || ''

function getToken(): string | null {
  return localStorage.getItem('zeva.accessToken')
}

async function request<T>(url: string, options: RequestInit = {}): Promise<{ data: T }> {
  const token = getToken()

  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('zeva.accessToken')
      localStorage.removeItem('zeva.refreshToken')
      window.location.href = '/login'
    }
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { message?: string }).message ?? `API error ${res.status}`)
  }

  const data = (await res.json()) as T
  return { data }
}

export async function httpGet<T>(url: string, params?: Record<string, unknown>): Promise<{ data: T }> {
  let path = url
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value))
      }
    })
    const qs = searchParams.toString()
    if (qs) path = `${url}?${qs}`
  }
  return request<T>(path)
}

export async function httpPost<B, T>(url: string, body: B): Promise<{ data: T }> {
  return request<T>(url, { method: 'POST', body: JSON.stringify(body) })
}

export async function httpPut<B, T>(url: string, body: B): Promise<{ data: T }> {
  return request<T>(url, { method: 'PUT', body: JSON.stringify(body) })
}

export async function httpPatch<B, T>(url: string, body: B): Promise<{ data: T }> {
  return request<T>(url, { method: 'PATCH', body: JSON.stringify(body) })
}

export async function httpDel<T>(url: string): Promise<{ data: T }> {
  return request<T>(url, { method: 'DELETE' })
}
