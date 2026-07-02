import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../platform/prisma';

export interface TokenPayload {
  sub: string; // userId
  email: string;
  orgId?: string; // active organization
  roleKey?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    orgName?: string,
  ) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: { name, email, passwordHash },
    });

    // If orgName provided, bootstrap an organization with this user as admin
    let membership = null;
    if (orgName) {
      const slug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const org = await this.prisma.organization.create({
        data: { name: orgName, slug },
      });

      // Find admin role
      const adminRole = await this.prisma.role.findUnique({
        where: { key: 'admin' },
      });
      if (adminRole) {
        membership = await this.prisma.membership.create({
          data: {
            userId: user.id,
            organizationId: org.id,
            roleId: adminRole.id,
          },
        });
      }
    }

    const tokens = await this.issueTokens(
      user.id,
      user.email,
      membership?.organizationId,
      'admin',
    );

    return {
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          where: { status: 'active' },
          include: { role: true },
          take: 1,
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const membership = user.memberships[0];
    const tokens = await this.issueTokens(
      user.id,
      user.email,
      membership?.organizationId,
      membership?.role?.key,
    );

    return {
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<TokenPayload>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      return this.issueTokens(
        payload.sub,
        payload.email,
        payload.orgId,
        payload.roleKey,
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: 'active' },
          include: { role: true, organization: true },
        },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      photoUrl: user.photoUrl,
      memberships: user.memberships.map((m) => ({
        organizationId: m.organizationId,
        organizationName: m.organization.name,
        role: m.role.key,
      })),
    };
  }

  private async issueTokens(
    userId: string,
    email: string,
    orgId?: string,
    roleKey?: string,
  ): Promise<AuthTokens> {
    const payload: TokenPayload = { sub: userId, email, orgId, roleKey };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRY', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRY', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
