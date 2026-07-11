import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/shell', async () =>
    HttpResponse.json(await import('./data/shell-info.json')),
  ),
]

export default handlers
