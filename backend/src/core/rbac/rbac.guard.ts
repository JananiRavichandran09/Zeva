import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../platform/prisma';
import { PERMISSION_KEY } from './require-permission.decorator';
import '../auth/types';
import type { Request } from 'express';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.getAllAndOverride<
      { permission: string; scope?: string } | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    // No permission required on this route — allow
    if (!meta) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) throw new ForbiddenException('Not authenticated');

    // Admin can do anything
    if (user.roleKey === 'admin') return true;

    // Look up user's role permissions
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role: { key: user.roleKey },
        permission: { key: meta.permission },
      },
      include: { permission: true },
    });

    if (rolePermissions.length === 0) {
      throw new ForbiddenException(`You lack permission: ${meta.permission}`);
    }

    // If a scope is required, check it matches
    if (meta.scope) {
      const hasScope = rolePermissions.some(
        (rp) => rp.scope === meta.scope || rp.scope === 'org',
      );
      if (!hasScope) {
        throw new ForbiddenException(
          `You lack permission: ${meta.permission} at scope ${meta.scope}`,
        );
      }
    }

    return true;
  }
}
