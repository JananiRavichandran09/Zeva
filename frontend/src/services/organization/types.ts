export interface Organization {
  id: string
  name: string
  slug: string
  domain: string | null
  counts: {
    members: number
    departments: number
    teams: number
    projects: number
    integrations: number
  }
}

export interface Department {
  id: string
  organizationId: string
  name: string
  _count: { memberships: number; teams: number }
}

export interface Team {
  id: string
  organizationId: string
  name: string
  department: { name: string } | null
  _count: { members: number }
}
