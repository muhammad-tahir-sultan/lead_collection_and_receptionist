import { useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as kbApi from '@/api/knowledge-base'
import type { KnowledgeDocument } from '@/api/knowledge-base'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import styles from './KnowledgeBase.module.css'

function formatTrained(iso: string | null): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  } catch {
    return '—'
  }
}

export function KnowledgeBase() {
  const { token } = useAuth()
  const [docs, setDocs] = useState<KnowledgeDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocs = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const { documents } = await kbApi.getKnowledgeDocuments(token)
      setDocs(documents)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Failed to load documents')
      setDocs([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  const handleFile = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || !token) return
      const file = files[0]
      const ext = (file.name.split('.').pop() ?? '').toLowerCase()
      if (!['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
        setError('Only PDF, DOC, DOCX, TXT allowed.')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large (max 10MB).')
        return
      }
      setUploading(true)
      setError(null)
      try {
        const { document } = await kbApi.uploadKnowledgeDocument(token, file)
        setDocs((prev) => [document, ...prev])
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err?.message ?? 'Upload failed')
      } finally {
        setUploading(false)
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [token]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!token) return
      try {
        await kbApi.deleteKnowledgeDocument(token, id)
        setDocs((prev) => prev.filter((d) => d.id !== id))
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err?.message ?? 'Delete failed')
      }
    },
    [token]
  )

  const handleTrain = useCallback(
    async (id: string) => {
      if (!token) return
      try {
        await kbApi.trainKnowledgeDocument(token, id)
        await fetchDocs()
      } catch (e: unknown) {
        const err = e as { message?: string }
        setError(err?.message ?? 'Train failed')
      }
    },
    [token, fetchDocs]
  )

  const isEmpty = docs.length === 0

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className={styles.page}>
      <PageSection>
        <div className={styles.headerRow}>
          <div>
            <PageTitle>Knowledge base</PageTitle>
            <PageSubtitle>Upload documents to train your AI receptionist</PageSubtitle>
          </div>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Add document'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className={styles.hiddenInput}
            onChange={(e) => handleFile(e.target.files)}
            aria-hidden
          />
        </div>
      </PageSection>

      {error && (
        <div className={styles.error} role="alert">
          {error}
          <Button variant="secondary" onClick={() => setError(null)}>Dismiss</Button>
        </div>
      )}

      <div
        className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneActive : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files)
        }}
      >
        <p className={styles.uploadText}>Drag and drop files here, or click &quot;Add document&quot; to browse</p>
        <p className={styles.uploadHint}>PDF, DOC, DOCX, TXT. Max 10MB per file.</p>
      </div>

      {isEmpty ? (
        <EmptyState
          title="No documents yet"
          description="Upload PDFs or docs so your AI receptionist can answer questions using your content."
          action={
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Upload first document
            </Button>
          }
        />
      ) : (
        <div className={styles.docList}>
          <h2 className={styles.listTitle}>Documents</h2>
          {docs.map((doc) => (
            <article key={doc.id} className={styles.docCard}>
              <div className={styles.docInfo}>
                <span className={styles.docName}>{doc.name}</span>
                <span className={styles.docMeta}>
                  {(doc.fileType ?? 'file').toUpperCase()} · {doc.status}
                </span>
                <span className={styles.docTrained}>
                  Last trained: {formatTrained(doc.lastTrainedAt)}
                </span>
                {doc.errorMessage && (
                  <span className={styles.docError}>{doc.errorMessage}</span>
                )}
              </div>
              <div className={styles.docActions}>
                {(doc.status === 'ready' || doc.status === 'failed') && (
                  <Button
                    variant="ghost"
                    className={styles.docBtn}
                    onClick={() => handleTrain(doc.id)}
                  >
                    Retrain
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className={styles.docBtn}
                  onClick={() => handleDelete(doc.id)}
                >
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
