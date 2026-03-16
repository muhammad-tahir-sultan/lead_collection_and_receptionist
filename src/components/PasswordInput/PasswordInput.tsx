import { forwardRef, useState } from 'react'
import styles from './PasswordInput.module.css'

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export type PasswordInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type'
> & {
  id: string
  label: string
  error?: string
  inputClassName?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { id, label, error, inputClassName, className, ...props },
    ref
  ) {
    const [show, setShow] = useState(false)

    return (
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <div className={[styles.inputWrap, error ? styles.inputWrapError : ''].filter(Boolean).join(' ')}>
          <input
            ref={ref}
            id={id}
            type={show ? 'text' : 'password'}
            className={[styles.input, inputClassName].filter(Boolean).join(' ')}
            aria-invalid={!!error}
            {...props}
          />
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {error && (
          <span className={styles.fieldError} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)
