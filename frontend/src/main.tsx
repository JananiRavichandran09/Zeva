import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { ThemeModeProvider } from '@/app/ThemeModeProvider'
import { AuthProvider } from '@/app/AuthProvider'
import { ShellProvider } from '@/app/ShellProvider'
import { queryClient } from '@/app/queryClient'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <BrowserRouter>
          <AuthProvider>
            <ShellProvider>
              <App />
            </ShellProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeModeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
