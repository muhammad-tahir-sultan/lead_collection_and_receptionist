import { useState, useRef } from 'react'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import styles from './KnowledgeBase.module.css'

// Mock documents
const MOCK_DOCS = [
  { id: '1', name: 'Company FAQ.pdf', type: 'PDF', status: 'ready', lastTrained: '1 day ago' },
  { id: '2', name: 'Product overview.docx', type: 'Doc', status: 'processing', lastTrained: '—' },
]

type DocStatus = 'ready' | 'processing' | 'failed'

export function KnowledgeBase() {
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (files: FileList | null) => {
    if (!files?.length) return
    const file = files[0]
    setDocs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() ?? 'File',
        status: 'processing' as DocStatus,
        lastTrained: '—',
      },
    ])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isEmpty = docs.length === 0

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
          >
            Add document
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
            <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
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
                <span className={styles.docMeta}>{doc.type} · {doc.status}</span>
                <span className={styles.docTrained}>Last trained: {doc.lastTrained}</span>
              </div>
              <div className={styles.docActions}>
                {doc.status === 'ready' && (
                  <Button variant="ghost" className={styles.docBtn}>Retrain</Button>
                )}
                <Button variant="ghost" className={styles.docBtn}>Remove</Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
