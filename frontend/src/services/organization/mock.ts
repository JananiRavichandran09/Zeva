import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/organization', async () =>
    HttpResponse.json(await import('./data/organization.json')),
  ),
  http.get('/api/organization/departments', async () =>
    HttpResponse.json(await import('./data/departments.json')),
  ),
  http.get('/api/organization/teams', async () =>
    HttpResponse.json(await import('./data/teams.json')),
  ),
]

export default handlers
