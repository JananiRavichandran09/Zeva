import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'required_permission';

/**
 * Decorator to mark a route as requiring a specific permission.
 * Usage: @RequirePermission('task:assign', 'team')
 */
export const RequirePermission = (permission: string, scope?: string) =>
  SetMetadata(PERMISSION_KEY, { permission, scope });
