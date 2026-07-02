export interface AdminDashboard {
  type: 'admin'
  org: {
    members: number
    departments: number
    teams: number
    projects: number
    integrations: number
  }
  tasks: Record<string, number>
}

export interface ManagerDashboard {
  type: 'manager'
  team: {
    members: { id: string; name: string; photoUrl: string | null; jobTitle: string | null }[]
    memberCount: number
  }
  tasks: { byStatus: Record<string, number>; blockers: number; lateTasks: number }
  meetings: DashboardMeeting[]
}

export interface EmployeeDashboard {
  type: 'employee'
  tasks: DashboardTask[]
  meetings: DashboardMeeting[]
  recommendations: unknown[]
}

export interface DashboardTask {
  id: string
  title: string
  status: string
  priority: string
  dueDate: string | null
  project: { name: string; key: string } | null
}

export interface DashboardMeeting {
  id: string
  title: string
  startsAt: string
  endsAt: string
  organizer: { id: string; name: string; photoUrl: string | null } | null
}

export type DashboardData = AdminDashboard | ManagerDashboard | EmployeeDashboard
