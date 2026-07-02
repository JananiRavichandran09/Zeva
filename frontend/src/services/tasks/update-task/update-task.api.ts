import { httpPatch } from '../../utils/http'
import type { UpdateTaskRequest, UpdateTaskResponse } from './types'

export const updateTask = async (params: UpdateTaskRequest): Promise<UpdateTaskResponse> => {
  const { id, ...body } = params
  const response = await httpPatch<Omit<UpdateTaskRequest, 'id'>, UpdateTaskResponse>(
    `/api/tasks/${id}`,
    body,
  )
  return response.data
}
