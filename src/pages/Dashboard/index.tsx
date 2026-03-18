import { Link } from 'react-router-dom'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Card, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import styles from './Dashboard.module.css'

// Mock data – replace with API when backend is ready
const MOCK_STATS = {
  leads: 24,
  calls: 12,
  knowledgeBaseDocs: 3,
  lastSync: '2 hours ago',
  lastTrained: '1 day ago',
}

const MOCK_RECENT = [
  { id: '1', type: 'lead', text: 'New lead from Apollo: Jane Doe (Acme Co)', time: '10 min ago' },
  { id: '2', type: 'call', text: 'Call handled by AI — 2 min', time: '45 min ago' },
  { id: '3', type: 'lead', text: 'New lead: John Smith', time: '2 hours ago' },
]

export function Dashboard() {
  return (
    <div className={styles.page}>
      <PageSection>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Overview of your leads and AI receptionist</PageSubtitle>
      </PageSection>

      <div className={styles.cards}>
        <Card>
          <CardTitle>Leads</CardTitle>
          <p className={styles.stat}>{MOCK_STATS.leads}</p>
          <p className={styles.muted}>Synced from Apollo.io</p>
          <p className={styles.timestamp}>Last sync: {MOCK_STATS.lastSync}</p>
        </Card>
        <Card>
          <CardTitle>Calls</CardTitle>
          <p className={styles.stat}>{MOCK_STATS.calls}</p>
          <p className={styles.muted}>Handled by AI receptionist</p>
        </Card>
        <Card>
          <CardTitle>Knowledge base</CardTitle>
          <p className={styles.stat}>{MOCK_STATS.knowledgeBaseDocs}</p>
          <p className={styles.muted}>Documents trained</p>
          <p className={styles.timestamp}>Last trained: {MOCK_STATS.lastTrained}</p>
        </Card>
      </div>

      <PageSection>
        <h2 className={styles.sectionHeading}>Quick actions</h2>
        <div className={styles.actions}>
          <Link to="/dashboard/knowledge-base">
            <Button variant="primary">Upload knowledge base</Button>
          </Link>
          <Link to="/dashboard/leads">
            <Button variant="secondary">View leads</Button>
          </Link>
        </div>
      </PageSection>

      <PageSection>
        <h2 className={styles.sectionHeading}>Recent activity</h2>
        <ul className={styles.recentList}>
          {MOCK_RECENT.map((item) => (
            <li key={item.id} className={styles.recentItem}>
              <span className={styles.recentText}>{item.text}</span>
              <span className={styles.recentTime}>{item.time}</span>
            </li>
          ))}
        </ul>
      </PageSection>
    </div>
  )
}
