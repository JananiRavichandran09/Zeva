import type { Task } from '../types'

export interface GetTasksParams {
  assignee?: string
  status?: string
  project?: string
}

export type GetTasksResponse = Task[]
