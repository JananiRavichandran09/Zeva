import type { AuthResponse } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export type LoginResponse = AuthResponse
