import { createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

// Keep MUI's surfaces in sync with the Tailwind tokens in index.css.
const tokens = {
  light: {
    canvas: '#f8fafc',
    surface: '#ffffff',
    line: '#e8ebf2',
    fg: '#0f172a',
    muted: '#64748b',
    brand: '#6c63ff',
    brand2: '#8b5cf6',
    accent: '#3ddc97',
  },
  dark: {
    canvas: '#0c0a14',
    surface: '#15121e',
    line: '#2a2438',
    fg: '#ece9f3',
    muted: '#a59fb5',
    brand: '#8b5cf6',
    brand2: '#a78bfa',
    accent: '#3ddc97',
  },
} as const

/** Build the MUI theme for a given mode. */
export function getTheme(mode: PaletteMode): Theme {
  const t = tokens[mode]

  return createTheme({
    palette: {
      mode,
      primary: { main: t.brand },
      secondary: { main: t.brand2 },
      success: { main: t.accent },
      background: {
        default: t.canvas,
        paper: t.surface,
      },
      text: {
        primary: t.fg,
        secondary: t.muted,
      },
      divider: t.line,
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily:
        'Inter, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  })
}
