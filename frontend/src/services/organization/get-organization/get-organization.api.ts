import { httpGet } from '../../utils/http'
import type { GetOrganizationResponse } from './types'

export const getOrganization = async (): Promise<GetOrganizationResponse> => {
  const response = await httpGet<GetOrganizationResponse>('/api/organization')
  return response.data
}
