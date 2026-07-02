/** The shape Passport attaches to `request.user` after JWT validation */
export interface JwtUser {
  userId: string;
  email: string;
  orgId: string;
  roleKey: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JwtUser {}
  }
}
