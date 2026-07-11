import authHandlers from './auth/mock'
import dashboardHandlers from './dashboard/mock'
import tasksHandlers from './tasks/mock'
import usersHandlers from './users/mock'
import meetingsHandlers from './meetings/mock'
import organizationHandlers from './organization/mock'
import shellHandlers from './shell/mock'

/**
 * All MSW handlers for local development / testing.
 * Import this into your MSW setup (browser or node).
 */
export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...tasksHandlers,
  ...usersHandlers,
  ...meetingsHandlers,
  ...organizationHandlers,
  ...shellHandlers,
]

export default handlers
