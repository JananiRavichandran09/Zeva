import { httpGet } from '../../utils/http'
import type { GetDashboardResponse } from './types'

export const getDashboard = async (): Promise<GetDashboardResponse> => {
  const response = await httpGet<GetDashboardResponse>('/api/dashboard')
  return response.data
}
