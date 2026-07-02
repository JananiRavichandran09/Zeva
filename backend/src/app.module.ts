import { Module } from '@nestjs/common';
import { AppConfigModule } from './platform/config';
import { PrismaModule } from './platform/prisma';
import { RedisModule } from './platform/redis';
import { AuthModule } from './core/auth/auth.module';
import { TenancyModule } from './core/tenancy/tenancy.module';
import { RbacModule } from './core/rbac/rbac.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Platform (global)
    AppConfigModule,
    PrismaModule,
    RedisModule,

    // Core
    AuthModule,
    TenancyModule,
    RbacModule,

    // Feature modules
    UsersModule,
    OrganizationModule,
    TasksModule,
    MeetingsModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
