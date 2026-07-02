import { httpPost } from '../../utils/http'
import type { RegisterRequest, RegisterResponse } from './types'

export const register = async (params: RegisterRequest): Promise<RegisterResponse> => {
  const response = await httpPost<RegisterRequest, RegisterResponse>('/api/auth/register', params)
  return response.data
}
