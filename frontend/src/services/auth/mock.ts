import { http, HttpResponse } from 'msw';

const handlers = [
  http.post('/api/auth/login', async () =>
    HttpResponse.json(await import('./data/login.json')),
  ),
  http.post('/api/auth/register', async () =>
    HttpResponse.json(await import('./data/register.json')),
  ),
  http.get('/api/auth/me', async () =>
    HttpResponse.json(await import('./data/me.json')),
  ),
]

export default handlers
