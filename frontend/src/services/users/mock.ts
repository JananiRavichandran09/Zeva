import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/users', async () =>
    HttpResponse.json(await import('./data/users.json')),
  ),
  http.get('/api/users/:id', async ({ params }) => {
    const users = (await import('./data/users.json')).default
    const user = users.find((u) => u.id === params.id)
    if (!user) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(user)
  }),
]

export default handlers
