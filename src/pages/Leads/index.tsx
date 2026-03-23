import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as leadsApi from '@/api/leads'
import type { Lead } from '@/api/leads'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import { LeadGenerationModal } from './LeadGenerationModal'
import styles from './Leads.module.css'

const PAGE_SIZE = 10

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function Leads() {
  const { token } = useAuth()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ data: Lead[]; total: number; page: number; limit: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set())

  const handleEnrich = async (id: string) => {
    if (!token) return
    setEnrichingIds((prev) => new Set(prev).add(id))
    try {
      const updatedLead = await leadsApi.enrichLead(token, id)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          data: prev.data.map((l) => (l.id === id ? updatedLead : l)),
        }
      })
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Failed to reveal contact info')
    } finally {
      setEnrichingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const fetchLeads = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await leadsApi.getLeads(token, {
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        source: sourceFilter === 'all' ? undefined : sourceFilter,
      })
      setData(res)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Failed to load leads')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [token, page, search, sourceFilter])

  const handleSync = useCallback(async () => {
    if (!token) return
    setSyncing(true)
    setError(null)
    try {
      await leadsApi.syncLeads(token)
      await fetchLeads()
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }, [token, fetchLeads])

  const handleExport = useCallback(async () => {
    if (!token) return
    setExporting(true)
    setError(null)
    try {
      await leadsApi.exportLeadsCsv(token, {
        search: search.trim() || undefined,
        source: sourceFilter === 'all' ? undefined : sourceFilter,
      })
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Export failed')
    } finally {
      setExporting(false)
    }
  }, [token, search, sourceFilter])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 0
  const list = data?.data ?? []

  return (
    <div className={styles.page}>
      <PageSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <PageTitle>Leads</PageTitle>
            <PageSubtitle>Leads synced from Apollo.io and other sources</PageSubtitle>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsGenerateModalOpen(true)}
            style={{ marginTop: '0.5rem' }}
          >
            Generate New Leads
          </Button>
        </div>
      </PageSection>

      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
          className={styles.searchInput}
          aria-label="Search leads"
        />
        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value)
            setPage(1)
          }}
          className={styles.select}
          aria-label="Filter by source"
        >
          <option value="all">All sources</option>
          <option value="apollo">Apollo</option>
          <option value="manual">Manual</option>
          <option value="import">Import</option>
        </select>
        <Button
          variant="secondary"
          className={styles.syncBtn}
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? 'Syncing…' : 'Sync latest'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>

      <LeadGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={() => {
          fetchLeads()
          // Optional: Show success snackbar/alert
        }}
      />

      {error && (
        <div className={styles.error} role="alert">
          {error}
          <Button variant="secondary" onClick={fetchLeads}>Retry</Button>
        </div>
      )}

      {loading ? (
        <PageSkeleton />
      ) : list.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={
            search || sourceFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Sync leads from Apollo.io or add leads to get started.'
          }
          action={
            sourceFilter === 'all' && !search ? (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
                  Generate Leads
                </Button>
                <Button variant="secondary" onClick={handleSync} disabled={syncing}>
                  Sync now
                </Button>
              </div>
            ) : null
          }
        />
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Social</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.cellName}>{lead.name}</td>
                    <td>
                      {lead.email ? (
                        lead.email
                      ) : lead.source === 'apollo' && lead.name.includes('*') ? (
                        <button
                          onClick={() => handleEnrich(lead.id)}
                          disabled={enrichingIds.has(lead.id)}
                          className={styles.revealBtn}
                        >
                          {enrichingIds.has(lead.id) ? '...' : 'Reveal'}
                        </button>
                      ) : (
                        lead.source === 'apollo' ? 'Unavailable' : '—'
                      )}
                    </td>
                    <td>
                      {lead.phone ? (
                        lead.phone
                      ) : lead.source === 'apollo' && lead.name.includes('*') ? (
                        <button
                          onClick={() => handleEnrich(lead.id)}
                          disabled={enrichingIds.has(lead.id)}
                          className={styles.revealBtn}
                        >
                          {enrichingIds.has(lead.id) ? '...' : 'Reveal'}
                        </button>
                      ) : (
                        lead.source === 'apollo' ? 'Unavailable' : '—'
                      )}
                    </td>
                    <td>{lead.company ?? '—'}</td>
                    <td>
                      {lead.linkedinUrl ? (
                        <a 
                          href={lead.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                        >
                          LinkedIn
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      <span className={styles.badge}>{lead.source}</span>
                    </td>
                    <td className={styles.cellDate}>{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.cardList}>
            {list.map((lead) => (
              <article key={lead.id} className={styles.leadCard}>
                <p className={styles.leadName}>{lead.name}</p>
                <div className={styles.leadMeta}>
                  <p>
                    {lead.email ? lead.email : lead.source === 'apollo' && lead.name.includes('*') ? (
                      <button onClick={() => handleEnrich(lead.id)} disabled={enrichingIds.has(lead.id)} className={styles.revealBtn}>Reveal Email</button>
                    ) : (lead.source === 'apollo' ? 'Unavailable' : '—')}
                    {' '}·{' '}
                    {lead.phone ? lead.phone : lead.source === 'apollo' && lead.name.includes('*') ? (
                      <button onClick={() => handleEnrich(lead.id)} disabled={enrichingIds.has(lead.id)} className={styles.revealBtn}>Reveal Phone</button>
                    ) : (lead.source === 'apollo' ? 'Unavailable' : '—')}
                  </p>
                  <p>{lead.company ?? '—'} · {lead.source}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {lead.linkedinUrl && (
                      <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        LinkedIn
                      </a>
                    )}
                    <span style={{ color: 'var(--text-muted)' }}>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

