import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { PasswordInput } from '@/components/PasswordInput'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import type { ApiError } from '@/api/client'
import styles from '@/styles/Auth.module.css'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    try {
      await login(data.email, data.password)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError((e as ApiError).message ?? 'Login failed')
    }
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={styles.card}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1 className={styles.title} variants={fadeInUp}>Sign in</motion.h1>
        <motion.p className={styles.subtitle} variants={fadeInUp}>Use your account to access the dashboard.</motion.p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && <div className={styles.error} role="alert">{error}</div>}
          <div className={styles.field}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={errors.email ? styles.inputError : undefined}
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email.message}</span>
            )}
          </div>
          <PasswordInput
            id="login-password"
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <motion.p className={styles.footer} variants={fadeInUp}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
