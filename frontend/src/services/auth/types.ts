export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface MeResponse {
  id: string
  name: string
  email: string
  jobTitle: string | null
  photoUrl: string | null
  memberships: {
    organizationId: string
    organizationName: string
    role: string
  }[]
}
