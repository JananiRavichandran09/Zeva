import { httpGet } from '../../utils/http'
import type { GetTeamsResponse } from './types'

export const getTeams = async (): Promise<GetTeamsResponse> => {
  const response = await httpGet<GetTeamsResponse>('/api/organization/teams')
  return response.data
}
