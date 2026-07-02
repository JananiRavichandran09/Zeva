import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { Spinner } from '@/components/ui'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-canvas">
        <Spinner label="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/landing" replace />
  }

  return <>{children}</>
}
