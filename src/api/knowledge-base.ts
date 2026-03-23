import { api } from './client'

export type KnowledgeDocument = {
  id: string
  tenantId: string
  name: string
  fileType: string | null
  fileUrl: string | null
  status: string
  errorMessage: string | null
  lastTrainedAt: string | null
  createdAt: string
  updatedAt: string
}

export type KnowledgeBaseListResponse = { documents: KnowledgeDocument[] }
export type KnowledgeBaseUploadResponse = { document: KnowledgeDocument }
export type KnowledgeBaseDeleteResponse = { ok: boolean }
export type KnowledgeBaseTrainResponse = { ok: boolean; message: string }

export function getKnowledgeDocuments(token: string): Promise<KnowledgeBaseListResponse> {
  return api<KnowledgeBaseListResponse>('/knowledge-base', { token })
}

export function uploadKnowledgeDocument(
  token: string,
  file: File
): Promise<KnowledgeBaseUploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const BASE_URL = import.meta.env.VITE_API_URL ?? ''
  return fetch(`${BASE_URL}/knowledge-base/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  }).then(async (res) => {
    const text = await res.text()
    const data = text ? JSON.parse(text) : undefined
    if (!res.ok) {
      const msg = data?.message ?? res.statusText
      throw { message: typeof msg === 'string' ? msg : msg?.[0] ?? res.statusText, status: res.status }
    }
    return data as KnowledgeBaseUploadResponse
  })
}

export function deleteKnowledgeDocument(
  token: string,
  id: string
): Promise<KnowledgeBaseDeleteResponse> {
  return api<KnowledgeBaseDeleteResponse>(`/knowledge-base/${id}`, {
    method: 'DELETE',
    token,
  })
}

export function trainKnowledgeDocument(
  token: string,
  id: string
): Promise<KnowledgeBaseTrainResponse> {
  return api<KnowledgeBaseTrainResponse>(`/knowledge-base/${id}/train`, {
    method: 'POST',
    token,
  })
}
