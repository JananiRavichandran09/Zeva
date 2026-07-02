import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/meetings', async () =>
    HttpResponse.json(await import('./data/meetings.json')),
  ),
  http.get('/api/meetings/:id', async ({ params }) => {
    const meetings = (await import('./data/meetings.json')).default
    const meeting = meetings.find((m) => m.id === params.id)
    if (!meeting) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(meeting)
  }),
]

export default handlers
