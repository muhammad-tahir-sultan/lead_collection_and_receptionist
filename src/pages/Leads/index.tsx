import { useState, useMemo } from 'react'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import styles from './Leads.module.css'

const PAGE_SIZE = 10

// Mock leads
const MOCK_LEADS = [
  { id: '1', name: 'Jane Doe', email: 'jane@acme.co', company: 'Acme Co', source: 'Apollo', date: '2025-03-16' },
  { id: '2', name: 'John Smith', email: 'john@tech.io', company: 'Tech Inc', source: 'Apollo', date: '2025-03-15' },
  { id: '3', name: 'Priya Patel', email: 'priya@startup.com', company: 'Startup LLC', source: 'Website', date: '2025-03-15' },
  { id: '4', name: 'Mike Johnson', email: 'mike@corp.com', company: 'Corp Ltd', source: 'Apollo', date: '2025-03-14' },
  { id: '5', name: 'Sarah Williams', email: 'sarah@biz.net', company: 'Biz Co', source: 'Apollo', date: '2025-03-14' },
]

export function Leads() {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = [...MOCK_LEADS]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q)
      )
    }
    if (sourceFilter !== 'all') {
      list = list.filter((l) => l.source === sourceFilter)
    }
    return list
  }, [search, sourceFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  return (
    <div className={styles.page}>
      <PageSection>
        <PageTitle>Leads</PageTitle>
        <PageSubtitle>Leads synced from Apollo.io and other sources</PageSubtitle>
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
          <option value="Apollo">Apollo</option>
          <option value="Website">Website</option>
        </select>
        <Button variant="primary" className={styles.syncBtn}>
          Sync now
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={search || sourceFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Sync leads from Apollo.io to get started.'}
          action={
            sourceFilter === 'all' && !search ? (
              <Button variant="primary">Sync now</Button>
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
                  <th>Company</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.cellName}>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.company}</td>
                    <td><span className={styles.badge}>{lead.source}</span></td>
                    <td className={styles.cellDate}>{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.cardList}>
            {paginated.map((lead) => (
              <article key={lead.id} className={styles.leadCard}>
                <p className={styles.leadName}>{lead.name}</p>
                <p className={styles.leadEmail}>{lead.email}</p>
                <p className={styles.leadMeta}>{lead.company} · {lead.source} · {lead.date}</p>
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
