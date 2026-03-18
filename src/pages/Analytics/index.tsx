import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Card, CardTitle } from '@/components/ui/Card'
import styles from './Analytics.module.css'

const DATE_RANGES = ['7', '30', '90'] as const

// Mock data
const MOCK_LEADS_OVER_TIME = [
  { date: 'Mon', leads: 4 },
  { date: 'Tue', leads: 6 },
  { date: 'Wed', leads: 3 },
  { date: 'Thu', leads: 8 },
  { date: 'Fri', leads: 5 },
  { date: 'Sat', leads: 2 },
  { date: 'Sun', leads: 1 },
]

const MOCK_CALLS_BY_DAY = [
  { day: 'Mon', calls: 5 },
  { day: 'Tue', calls: 7 },
  { day: 'Wed', calls: 4 },
  { day: 'Thu', calls: 9 },
  { day: 'Fri', calls: 6 },
]

export function Analytics() {
  const [range, setRange] = useState<string>('30')

  return (
    <div className={styles.page}>
      <PageSection>
        <div className={styles.headerRow}>
          <div>
            <PageTitle>Analytics</PageTitle>
            <PageSubtitle>Leads, calls, and receptionist usage</PageSubtitle>
          </div>
          <div className={styles.dateRange}>
            <span className={styles.dateLabel}>Period:</span>
            {DATE_RANGES.map((r) => (
              <button
                key={r}
                type="button"
                className={range === r ? styles.rangeBtnActive : styles.rangeBtn}
                onClick={() => setRange(r)}
              >
                Last {r} days
              </button>
            ))}
          </div>
        </div>
      </PageSection>

      <div className={styles.summaryCards}>
        <Card>
          <CardTitle>Total leads</CardTitle>
          <p className={styles.summaryValue}>29</p>
        </Card>
        <Card>
          <CardTitle>Total calls</CardTitle>
          <p className={styles.summaryValue}>31</p>
        </Card>
        <Card>
          <CardTitle>Avg call duration</CardTitle>
          <p className={styles.summaryValue}>2m 14s</p>
        </Card>
      </div>

      <PageSection>
        <h2 className={styles.chartTitle}>Leads over time</h2>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MOCK_LEADS_OVER_TIME} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Line type="monotone" dataKey="leads" stroke="var(--color-sage)" strokeWidth={2} dot={{ fill: 'var(--color-sage)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PageSection>

      <PageSection>
        <h2 className={styles.chartTitle}>Calls by day</h2>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MOCK_CALLS_BY_DAY} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Bar dataKey="calls" fill="var(--color-sage)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PageSection>
    </div>
  )
}
