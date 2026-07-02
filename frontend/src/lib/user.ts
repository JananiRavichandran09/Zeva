// Mock signed-in user. Replace with real auth/profile data once the
// backend is wired up.

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
  joinedAt: string
  timezone: string
  plan: string
}

export const currentUser: CurrentUser = {
  id: 'usr_001',
  name: 'Janani R',
  email: 'jr@gmail.com',
  role: 'Software Engineer',
  avatarUrl: undefined, // falls back to initials in the Avatar component
  joinedAt: 'June 2026',
  timezone: 'Asia/Kolkata (GMT+5:30)',
  plan: 'Pro',
}
