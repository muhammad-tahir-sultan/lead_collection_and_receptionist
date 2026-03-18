import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`${styles.card} ${className}`.trim()} {...props} />
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`${styles.header} ${className}`.trim()} {...props} />
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`${styles.title} ${className}`.trim()} {...props} />
}
