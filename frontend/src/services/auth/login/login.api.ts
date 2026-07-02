import { httpPost } from '../../utils/http'
import type { LoginRequest, LoginResponse } from './types'

export const login = async (params: LoginRequest): Promise<LoginResponse> => {
  const response = await httpPost<LoginRequest, LoginResponse>('/api/auth/login', params)
  return response.data
}
