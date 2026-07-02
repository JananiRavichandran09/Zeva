import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import type { PaletteMode } from '@mui/material'
import { getTheme } from './theme'

const STORAGE_KEY = 'zeva.theme-mode'

interface ThemeModeContextValue {
  mode: PaletteMode
  toggleMode: () => void
  setMode: (mode: PaletteMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined,
)

function getInitialMode(): PaletteMode {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * Provides the current color mode, persists it, syncs the `.dark` class on
 * <html>, and wires the matching MUI theme. Wrap the app once near the root.
 */
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode)

  // Keep the <html> class and storage in sync with the mode.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const theme = useMemo(() => getTheme(mode), [mode])

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

/** Access and control the current color mode. */
export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider')
  }
  return ctx
}
