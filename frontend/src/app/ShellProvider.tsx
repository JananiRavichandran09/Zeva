import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useQueryGetShell } from '@/services/shell'
import type { ShellInfo, FeatureFlags, ShellMenuItem } from '@/services/shell'
import { Spinner } from '@/components/ui'

interface ShellContextValue {
  shell: ShellInfo
  features: FeatureFlags
  menu: ShellMenuItem[]
  isFeatureEnabled: (flag: string) => boolean
}

const ShellContext = createContext<ShellContextValue | undefined>(undefined)

export function ShellProvider({ children }: { children: ReactNode }) {
  const { shellData, isLoading } = useQueryGetShell()

  if (isLoading || !shellData) {
    return (
      <div className="grid h-screen place-items-center bg-canvas">
        <Spinner label="Loading application..." />
      </div>
    )
  }

  const isFeatureEnabled = (flag: string): boolean => {
    const value = shellData.features[flag]
    if (value === undefined) return false
    if (typeof value === 'boolean') return value
    return value === 'true' || value === 'TRUE'
  }

  // Filter menu items by feature flag
  const menu = shellData.menu.filter((item) => {
    if (!item.featureFlag) return true
    return isFeatureEnabled(item.featureFlag)
  })

  return (
    <ShellContext.Provider value={{ shell: shellData, features: shellData.features, menu, isFeatureEnabled }}>
      {children}
    </ShellContext.Provider>
  )
}

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used within a ShellProvider')
  return ctx
}

export function useFeatureFlag(flag: string): boolean {
  const { isFeatureEnabled } = useShell()
  return isFeatureEnabled(flag)
}
