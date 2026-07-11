export interface ShellProfile {
  userId: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  orgId: string
  avatar: Record<string, unknown>
  jobTitle: string
  tenantId: string
  app: string
  userRoles: string[]
  isManager: boolean
}

export interface ShellMenuItem {
  id: string
  label: string
  shape?: string
  path?: string
  featureFlag?: string
  items?: ShellMenuItem[]
}

export interface ShellPreferences {
  theme: string
}

export type FeatureFlags = Record<string, boolean | string>

export interface ShellInfo {
  profile: ShellProfile
  menu: ShellMenuItem[]
  preferences: ShellPreferences
  features: FeatureFlags
  onboardingComplete: boolean
}
