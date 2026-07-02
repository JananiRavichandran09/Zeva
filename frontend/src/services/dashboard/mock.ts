import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/dashboard', async () =>
    HttpResponse.json(await import('./data/dashboard-admin.json')),
  ),
]

export default handlers
