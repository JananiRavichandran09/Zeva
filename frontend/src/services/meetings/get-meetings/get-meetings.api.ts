import { httpGet } from '../../utils/http'
import type { GetMeetingsResponse } from './types'

export const getMeetings = async (): Promise<GetMeetingsResponse> => {
  const response = await httpGet<GetMeetingsResponse>('/api/meetings')
  return response.data
}
