import type { AuthResponse } from '../types'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  orgName?: string
}

export type RegisterResponse = AuthResponse
