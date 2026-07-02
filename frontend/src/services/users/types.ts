export interface TeamMember {
  id: string
  name: string
  email: string
  jobTitle: string | null
  department: string | null
  photoUrl: string | null
  role: string
  roleName: string
  managerId: string | null
  status: string
}
