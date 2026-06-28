import { createTheme } from '@mui/material/styles'

// Central MUI theme. Tweak palette/typography here and it flows through the app.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6d28d9', // violet-700 — Zeva's accent
    },
    secondary: {
      main: '#0ea5e9', // sky-500
    },
    background: {
      default: '#f8fafc', // slate-50
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      'Inter, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
})
