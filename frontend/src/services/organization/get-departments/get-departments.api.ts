import { httpGet } from '../../utils/http'
import type { GetDepartmentsResponse } from './types'

export const getDepartments = async (): Promise<GetDepartmentsResponse> => {
  const response = await httpGet<GetDepartmentsResponse>('/api/organization/departments')
  return response.data
}
