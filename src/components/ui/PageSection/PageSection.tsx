import type { HTMLAttributes } from 'react'
import styles from './PageSection.module.css'

export function PageSection({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`${styles.section} ${className}`.trim()} {...props} />
}

export function PageTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={`${styles.title} ${className}`.trim()} {...props} />
}

export function PageSubtitle({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`${styles.subtitle} ${className}`.trim()} {...props} />
}
