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

const schema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function Signup() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    try {
      await registerUser(data.email, data.password, data.name)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError((e as ApiError).message ?? 'Sign up failed')
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
        <motion.h1 className={styles.title} variants={fadeInUp}>Create account</motion.h1>
        <motion.p className={styles.subtitle} variants={fadeInUp}>Sign up to get started.</motion.p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && <div className={styles.error} role="alert">{error}</div>}
          <div className={styles.field}>
            <label htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              {...register('name')}
              className={errors.name ? styles.inputError : undefined}
            />
            {errors.name && (
              <span className={styles.fieldError}>{errors.name.message}</span>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
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
            id="signup-password"
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordInput
            id="signup-confirm"
            label="Confirm password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <motion.p className={styles.footer} variants={fadeInUp}>
          Already have an account? <Link to="/login">Sign in</Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
