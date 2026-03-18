import styles from './LoadingSkeleton.module.css'

export function PageSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.title} />
      <div className={styles.subtitle} />
      <div className={styles.cards}>
        <div className={styles.card} />
        <div className={styles.card} />
        <div className={styles.card} />
      </div>
      <div className={styles.block} />
      <div className={styles.block} />
    </div>
  )
}
