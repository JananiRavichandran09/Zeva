import type { Task } from '../types'

export interface UpdateTaskRequest {
  id: string
  title?: string
  description?: string
  status?: string
  priority?: string
  assigneeId?: string
  dueDate?: string
}

export type UpdateTaskResponse = Task
