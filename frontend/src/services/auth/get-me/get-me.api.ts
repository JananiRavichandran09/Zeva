import { httpGet } from '../../utils/http'
import type { GetMeResponse } from './types'

export const getMe = async (): Promise<GetMeResponse> => {
  const response = await httpGet<GetMeResponse>('/api/auth/me')
  return response.data
}
