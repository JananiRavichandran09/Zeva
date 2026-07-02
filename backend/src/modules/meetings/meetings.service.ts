import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';

interface CreateMeetingDto {
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  agenda?: string;
  organizerId?: string;
}

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.meeting.findMany({
      where: { organizationId: orgId },
      include: {
        organizer: { select: { id: true, name: true, photoUrl: true } },
        _count: { select: { actionItems: true } },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  async findOne(id: string, orgId: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, organizationId: orgId },
      include: {
        organizer: {
          select: { id: true, name: true, email: true, photoUrl: true },
        },
        actionItems: {
          include: { owner: { select: { id: true, name: true } } },
        },
      },
    });
    if (!meeting) throw new NotFoundException('Meeting not found');
    return meeting;
  }

  async create(orgId: string, dto: CreateMeetingDto) {
    return this.prisma.meeting.create({
      data: {
        organizationId: orgId,
        title: dto.title,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        location: dto.location,
        agenda: dto.agenda,
        organizerId: dto.organizerId,
      },
      include: {
        organizer: { select: { id: true, name: true, photoUrl: true } },
      },
    });
  }
}
