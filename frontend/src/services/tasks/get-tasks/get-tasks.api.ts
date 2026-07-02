import { httpGet } from '../../utils/http'
import type { GetTasksParams, GetTasksResponse } from './types'

export const getTasks = async (params: GetTasksParams = {}): Promise<GetTasksResponse> => {
  const response = await httpGet<GetTasksResponse>('/api/tasks', {
    assignee: params.assignee,
    status: params.status,
    project: params.project,
  })
  return response.data
}
