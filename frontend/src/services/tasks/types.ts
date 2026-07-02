export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  assignee: { id: string; name: string; photoUrl: string | null } | null
  project: { id: string; name: string; key: string } | null
  createdAt: string
}
