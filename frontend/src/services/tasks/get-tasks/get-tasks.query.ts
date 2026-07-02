import { getTasks } from './get-tasks.api'
import type { GetTasksParams } from './types'

export const queryGetTasks = (params: GetTasksParams = {}) => ({
  queryKey: ['getTasks', params.assignee ?? '', params.status ?? '', params.project ?? ''],
  queryFn: () => getTasks(params),
  staleTime: 1000 * 60 * 1, // 1 minute
})
