import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import '../auth/types';
import type { Request } from 'express';

/**
 * Extracts organizationId from the JWT payload and attaches it to
 * `request.orgId` so controllers and services can use it for scoping.
 */
@Injectable()
export class TenancyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.user?.orgId) {
      Object.assign(request, { orgId: request.user.orgId });
    }

    return next.handle();
  }
}
