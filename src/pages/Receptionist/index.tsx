import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as receptionistApi from '@/api/receptionist'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import styles from './Receptionist.module.css'

const DEFAULT_GREETING = 'Hello! Thanks for calling. How can I help you today?'
const DEFAULT_OUTSIDE = "We're currently closed. Please leave a message or call back during business hours."

export function Receptionist() {
  const { token } = useAuth()
  const [enabled, setEnabled] = useState(true)
  const [greeting, setGreeting] = useState(DEFAULT_GREETING)
  const [sameEveryDay, setSameEveryDay] = useState(true)
  const [weekdayHours, setWeekdayHours] = useState({ start: '09:00', end: '17:00' })
  const [outsideHoursMessage, setOutsideHoursMessage] = useState(DEFAULT_OUTSIDE)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadConfig = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const { config } = await receptionistApi.getReceptionistConfig(token)
      if (config) {
        setEnabled(config.enabled)
        setGreeting(config.greetingText ?? DEFAULT_GREETING)
        setSameEveryDay(config.businessHoursSame)
        setWeekdayHours({
          start: config.businessHoursStart ?? '09:00',
          end: config.businessHoursEnd ?? '17:00',
        })
        setOutsideHoursMessage(config.outsideHoursMessage ?? DEFAULT_OUTSIDE)
      }
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Failed to load config')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      await receptionistApi.updateReceptionistConfig(token, {
        enabled,
        greetingText: greeting.trim() || null,
        businessHoursSame: sameEveryDay,
        businessHoursStart: sameEveryDay ? weekdayHours.start : null,
        businessHoursEnd: sameEveryDay ? weekdayHours.end : null,
        outsideHoursMessage: outsideHoursMessage.trim() || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className={styles.page}>
      <PageSection>
        <PageTitle>AI Receptionist</PageTitle>
        <PageSubtitle>Configure how your receptionist greets callers and when it's available</PageSubtitle>
      </PageSection>

      {error && (
        <div className={styles.error} role="alert">
          {error}
          <Button variant="secondary" onClick={loadConfig}>Retry</Button>
        </div>
      )}

      <Card className={styles.card}>
        <div className={styles.toggleRow}>
          <div>
            <h3 className={styles.toggleLabel}>Enable AI receptionist</h3>
            <p className={styles.toggleHint}>When on, calls are answered by your AI using the knowledge base.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            className={`${styles.toggle} ${enabled ? styles.toggleOn : ''}`}
            onClick={() => setEnabled((v) => !v)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </Card>

      <Card className={styles.card}>
        <label className={styles.label}>
          Greeting
          <span className={styles.labelHint}>What callers hear first</span>
        </label>
        <textarea
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          className={styles.textarea}
          rows={3}
          placeholder="e.g. Hello! Thanks for calling. How can I help?"
        />
      </Card>

      <Card className={styles.card}>
        <h3 className={styles.sectionLabel}>Business hours</h3>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={sameEveryDay}
            onChange={(e) => setSameEveryDay(e.target.checked)}
          />
          Same hours every day
        </label>
        {sameEveryDay ? (
          <div className={styles.timeRow}>
            <input
              type="time"
              value={weekdayHours.start}
              onChange={(e) => setWeekdayHours((h) => ({ ...h, start: e.target.value }))}
              className={styles.timeInput}
            />
            <span className={styles.timeTo}>to</span>
            <input
              type="time"
              value={weekdayHours.end}
              onChange={(e) => setWeekdayHours((h) => ({ ...h, end: e.target.value }))}
              className={styles.timeInput}
            />
          </div>
        ) : (
          <p className={styles.placeholder}>Per-day schedule (optional — add later)</p>
        )}
      </Card>

      <Card className={styles.card}>
        <label className={styles.label}>Message when outside hours</label>
        <textarea
          value={outsideHoursMessage}
          onChange={(e) => setOutsideHoursMessage(e.target.value)}
          className={styles.textarea}
          rows={2}
        />
      </Card>

      <div className={styles.actions}>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
        </Button>
        {saved && !saving && <span className={styles.savedHint}>Settings updated.</span>}
      </div>
    </div>
  )
}
