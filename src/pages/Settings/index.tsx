import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PageSection, PageTitle, PageSubtitle } from '@/components/ui/PageSection'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PasswordInput } from '@/components/PasswordInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './Settings.module.css'

const TABS = ['Profile', 'Integrations', 'Preferences'] as const
type Tab = (typeof TABS)[number]

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

type PasswordForm = z.infer<typeof passwordSchema>

export function Settings() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('Profile')
  const [apolloKey, setApolloKey] = useState('')
  const [apolloConnected, setApolloConnected] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onPasswordSubmit = (data: PasswordForm) => {
    // TODO: API call to change password
    reset()
  }

  return (
    <div className={styles.page}>
      <PageSection>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your profile, integrations, and preferences</PageSubtitle>
      </PageSection>

      <div className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? styles.tabActive : styles.tab}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Profile' && (
        <div className={styles.panel}>
          <Card className={styles.card}>
            <h3 className={styles.cardTitle}>Profile</h3>
            <dl className={styles.dl}>
              <dt>Name</dt>
              <dd>{user?.name ?? '—'}</dd>
              <dt>Email</dt>
              <dd>{user?.email ?? '—'}</dd>
            </dl>
          </Card>
          <Card className={styles.card}>
            <h3 className={styles.cardTitle}>Change password</h3>
            <form onSubmit={handleSubmit(onPasswordSubmit)} className={styles.form}>
              <PasswordInput
                id="current-password"
                label="Current password"
                autoComplete="current-password"
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
              <PasswordInput
                id="new-password"
                label="New password"
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <PasswordInput
                id="confirm-password"
                label="Confirm new password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <Button type="submit" variant="primary">Update password</Button>
            </form>
          </Card>
        </div>
      )}

      {tab === 'Integrations' && (
        <div className={styles.panel}>
          <Card className={styles.card}>
            <h3 className={styles.cardTitle}>Apollo.io</h3>
            <p className={styles.cardDesc}>Connect your Apollo.io account to sync leads.</p>
            {apolloConnected ? (
              <p className={styles.connected}>Connected</p>
            ) : (
              <div className={styles.inputRow}>
                <input
                  type="password"
                  placeholder="API key"
                  value={apolloKey}
                  onChange={(e) => setApolloKey(e.target.value)}
                  className={styles.input}
                  aria-label="Apollo API key"
                />
                <Button variant="primary" onClick={() => setApolloConnected(true)}>Connect</Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'Preferences' && (
        <div className={styles.panel}>
          <Card className={styles.card}>
            <h3 className={styles.cardTitle}>Preferences</h3>
            <p className={styles.cardDesc}>Timezone and display options (coming soon).</p>
          </Card>
        </div>
      )}
    </div>
  )
}
