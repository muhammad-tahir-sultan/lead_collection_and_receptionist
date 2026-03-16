import { Link } from 'react-router-dom'
import styles from './Dashboard.module.css'

export function Dashboard() {
  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>
      <p className={styles.subtitle}>Overview of your leads and AI receptionist</p>

      <div className={styles.cards}>
        <article className={styles.card}>
          <h3>Leads</h3>
          <p className={styles.stat}>—</p>
          <p className={styles.muted}>Synced from Apollo.io</p>
        </article>
        <article className={styles.card}>
          <h3>Calls</h3>
          <p className={styles.stat}>—</p>
          <p className={styles.muted}>Handled by AI receptionist</p>
        </article>
        <article className={styles.card}>
          <h3>Knowledge base</h3>
          <p className={styles.stat}>—</p>
          <p className={styles.muted}>Documents trained</p>
        </article>
      </div>

      <section className={styles.section}>
        <h2>Quick actions</h2>
        <div className={styles.actions}>
          <Link to="/knowledge-base" className={styles.button}>Upload knowledge base</Link>
          <Link to="/leads" className={styles.buttonSecondary}>View leads</Link>
        </div>
      </section>
    </div>
  )
}
