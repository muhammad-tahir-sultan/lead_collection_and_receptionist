const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export type ApiError = { message: string; status: number }

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  const data = text ? (JSON.parse(text) as T) : (undefined as T)
  if (!res.ok) {
    const raw = (data as { message?: string | string[] })?.message
    const message =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] ?? res.statusText : res.statusText
    throw { message, status: res.status } as ApiError
  }
  return data as T
}

export async function api<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { token?: string; body?: any } = {}
): Promise<T> {
  const { token, body, ...init } = options
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let fetchBody = body
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
    fetchBody = JSON.stringify(body)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const res = await fetch(url, { ...init, headers, body: fetchBody })
  return handleResponse<T>(res)
}

