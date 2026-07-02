import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

// ── Mock auth ──────────────────────────────────────────────────────────
// The backend has been removed and will be rebuilt against the architecture
// in /docs (see 10-technical-architecture.md + 12-api-specifications.md).
// Until then, auth runs entirely client-side so the app is usable: any valid
// email + password signs you in, and the session persists in localStorage.
// Replace `login`/`register` with real API calls once the backend exists.

const TOKEN_KEY = 'zeva.token'
const USER_KEY = 'zeva.user'

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

/** Turn "jane.doe@acme.com" into a friendly "Jane Doe" for display. */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  const name = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
  return name || 'There'
}

function makeToken(): string {
  return `mock.${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`
}

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Session is restored synchronously from localStorage — no backend round-trip.
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  )
  // Kept for API compatibility with consumers; nothing async gates startup.
  const [loading] = useState(false)

  const persistSession = useCallback((nextUser: AuthUser) => {
    const nextToken = makeToken()
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const registerFn = useCallback(
    async (name: string, email: string) => {
      persistSession({
        id: `usr_${Date.now().toString(36)}`,
        name: name.trim() || nameFromEmail(email),
        email: email.trim(),
      })
    },
    [persistSession],
  )

  const loginFn = useCallback(
    async (email: string) => {
      // No backend to verify against yet — accept any valid credentials.
      persistSession({
        id: `usr_${Date.now().toString(36)}`,
        name: nameFromEmail(email),
        email: email.trim(),
      })
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
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
