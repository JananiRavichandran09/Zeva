import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

const API = import.meta.env.VITE_API_URL || ''
const ACCESS_KEY = 'zeva.accessToken'
const REFRESH_KEY = 'zeva.refreshToken'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null,
  )
  const [loading, setLoading] = useState(true)

  // On mount, validate stored token by fetching /auth/me
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Invalid token')
        const data = await res.json()
        setUser({ id: data.id, name: data.name, email: data.email })
      })
      .catch(() => {
        // Token expired or invalid — clear
        localStorage.removeItem(ACCESS_KEY)
        localStorage.removeItem(REFRESH_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const persistSession = useCallback(
    (accessToken: string, refreshToken: string, userData: AuthUser) => {
      localStorage.setItem(ACCESS_KEY, accessToken)
      localStorage.setItem(REFRESH_KEY, refreshToken)
      setToken(accessToken)
      setUser(userData)
    },
    [],
  )

  const registerFn = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      persistSession(data.accessToken, data.refreshToken, data.user)
    },
    [persistSession],
  )

  const loginFn = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      persistSession(data.accessToken, data.refreshToken, data.user)
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      register: registerFn,
      login: loginFn,
      logout,
    }),
    [user, token, loading, registerFn, loginFn, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
