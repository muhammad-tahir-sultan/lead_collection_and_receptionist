import { api } from './client'

export type Lead = {
  id: string
  tenantId: string
  externalId: string | null
  name: string
  email: string | null
  phone: string | null
  company: string | null
  jobTitle: string | null
  linkedinUrl: string | null
  source: string
  createdAt: string
}

export type LeadsListParams = {
  page?: number
  limit?: number
  search?: string
  source?: string
}

export type LeadsListResponse = {
  data: Lead[]
  total: number
  page: number
  limit: number
}

export type LeadsSyncResponse = { ok: boolean; message: string }

export function getLeads(
  token: string,
  params?: LeadsListParams
): Promise<LeadsListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set('page', String(params.page))
  if (params?.limit != null) searchParams.set('limit', String(params.limit))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.source) searchParams.set('source', params.source)
  const qs = searchParams.toString()
  return api<LeadsListResponse>(`/leads${qs ? `?${qs}` : ''}`, { token })
}

export function syncLeads(token: string): Promise<LeadsSyncResponse> {
  return api<LeadsSyncResponse>('/leads/sync', {
    method: 'POST',
    token,
  })
}

export type ApolloSearchParams = {
  q_organization_domains?: string | string[]
  person_titles?: string[]
  person_locations?: string[]
  q_keywords?: string
  page?: number
  per_page?: number
}

export function generateLeads(
  token: string,
  params: ApolloSearchParams
): Promise<{ ok: boolean; total: number }> {
  return api<{ ok: boolean; total: number }>('/leads/generate', {
    method: 'POST',
    token,
    body: params,
  })
}

export function enrichLead(
  token: string,
  leadId: string
): Promise<Lead> {
  return api<Lead>(`/leads/${leadId}/enrich`, {
    method: 'POST',
    token,
  })
}

/** Fetches CSV and triggers browser download. Uses current list filters (search, source). */

export async function exportLeadsCsv(
  token: string,
  params?: { search?: string; source?: string }
): Promise<void> {
  const BASE_URL = import.meta.env.VITE_API_URL ?? ''
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.source && params.source !== 'all') searchParams.set('source', params.source)
  const qs = searchParams.toString()
  const res = await fetch(`${BASE_URL}/leads/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text()
    const data = text ? JSON.parse(text) : {}
    const msg = data?.message ?? res.statusText
    throw { message: typeof msg === 'string' ? msg : msg?.[0] ?? res.statusText, status: res.status }
  }
  const blob = new Blob([await res.text()], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'leads.csv'
  a.click()
  URL.revokeObjectURL(url)
}
