import { httpGet } from '../../utils/http'
import type { GetUsersResponse } from './types'

export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await httpGet<GetUsersResponse>('/api/users')
  return response.data
}
