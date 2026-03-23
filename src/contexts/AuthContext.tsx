import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '@/api/auth'
import type { User } from '@/api/auth'

const TOKEN_KEY = 'auth_token'

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User; token: string }
  | { status: 'unauthenticated' }

type AuthContextValue = {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  const loadUser = useCallback(async (token: string) => {
    try {
      const { user } = await authApi.me(token)
      setState({ status: 'authenticated', user, token })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setState({ status: 'unauthenticated' })
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState({ status: 'unauthenticated' })
      return
    }
    loadUser(token)
  }, [loadUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const { user, token } = await authApi.login({ email, password })
      localStorage.setItem(TOKEN_KEY, token)
      setState({ status: 'authenticated', user, token })
    },
    []
  )

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { user, token } = await authApi.register({ email, password, name })
      localStorage.setItem(TOKEN_KEY, token)
      setState({ status: 'authenticated', user, token })
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setState({ status: 'unauthenticated' })
  }, [])

  const value: AuthContextValue = {
    state,
    login,
    register,
    logout,
    isAuthenticated: state.status === 'authenticated',
    user: state.status === 'authenticated' ? state.user : null,
    token: state.status === 'authenticated' ? state.token : null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
