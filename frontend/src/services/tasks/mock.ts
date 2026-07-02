import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/tasks', async () =>
    HttpResponse.json(await import('./data/tasks.json')),
  ),
  http.patch('/api/tasks/:id', async ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Updated task',
      status: 'done',
      priority: 'medium',
      dueDate: null,
      assignee: { id: 'usr_003', name: 'Janani', photoUrl: null },
      project: { id: 'proj_001', name: 'Zeva MVP', key: 'ZEVA' },
      createdAt: '2026-07-01T10:00:00.000Z',
      description: null,
    })
  }),
]

export default handlers
