import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.findFirst()
  const janani = await prisma.user.findFirst({ where: { email: 'janani@cornerstone.dev' } })
  const rahul = await prisma.user.findFirst({ where: { email: 'rahul@cornerstone.dev' } })

  if (!org || !janani || !rahul) {
    console.log('Run the main seed first')
    return
  }

  // Focus block for Janani
  await prisma.calendarEvent.create({
    data: {
      organizationId: org.id,
      userId: janani.id,
      title: 'Focus Time — Auth Module',
      startsAt: new Date('2026-07-03T08:00:00Z'),
      endsAt: new Date('2026-07-03T10:00:00Z'),
      type: 'focus',
    },
  })

  // Another meeting
  await prisma.meeting.create({
    data: {
      organizationId: org.id,
      organizerId: janani.id,
      title: 'Code Review — RBAC PR',
      startsAt: new Date('2026-07-04T07:00:00Z'),
      endsAt: new Date('2026-07-04T07:30:00Z'),
      sourceSystem: 'teams',
    },
  })

  // Design sync
  await prisma.meeting.create({
    data: {
      organizationId: org.id,
      organizerId: rahul.id,
      title: 'Design Sync — Dashboard UI',
      startsAt: new Date('2026-07-05T09:00:00Z'),
      endsAt: new Date('2026-07-05T09:45:00Z'),
      sourceSystem: 'outlook',
      agenda: 'Review new dashboard mockups and component library',
    },
  })

  // Task due dates
  await prisma.task.updateMany({
    where: { title: 'Implement auth module' },
    data: { dueDate: new Date('2026-07-05T00:00:00Z') },
  })

  await prisma.task.updateMany({
    where: { title: 'Integrate Entra ID' },
    data: { dueDate: new Date('2026-07-07T00:00:00Z') },
  })

  await prisma.task.updateMany({
    where: { title: 'Build dashboard API' },
    data: { dueDate: new Date('2026-07-06T00:00:00Z') },
  })

  console.log('✅ Calendar events seeded!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
