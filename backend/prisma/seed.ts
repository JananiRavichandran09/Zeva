import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Roles ──────────────────────────────────────────────────────────────
  const roles = await Promise.all(
    [
      { key: 'admin', name: 'Admin' },
      { key: 'manager', name: 'Manager' },
      { key: 'lead', name: 'Lead' },
      { key: 'developer', name: 'Developer' },
      { key: 'qa', name: 'QA' },
      { key: 'hr', name: 'HR' },
    ].map((r) =>
      prisma.role.upsert({
        where: { key: r.key },
        update: {},
        create: r,
      }),
    ),
  );

  const roleMap = Object.fromEntries(roles.map((r) => [r.key, r]));

  // ─── Permissions ────────────────────────────────────────────────────────
  const permissionKeys = [
    'org:manage',
    'org:view_health',
    'integration:connect',
    'user:invite',
    'user:manage_roles',
    'department:manage',
    'team:manage',
    'team:view',
    'project:view',
    'task:view',
    'task:assign',
    'task:update_status',
    'meeting:view',
    'note:create',
    'blocker:review',
    'analytics:view',
  ];

  const permissions = await Promise.all(
    permissionKeys.map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      }),
    ),
  );

  const permMap = Object.fromEntries(permissions.map((p) => [p.key, p]));

  // ─── Role–Permission mappings (simplified from doc 07 matrix) ──────────
  const rolePerms: { role: string; perm: string; scope: string }[] = [
    // Admin — full org scope
    ...permissionKeys.map((p) => ({ role: 'admin', perm: p, scope: 'org' })),
    // Manager
    { role: 'manager', perm: 'team:manage', scope: 'team' },
    { role: 'manager', perm: 'team:view', scope: 'team' },
    { role: 'manager', perm: 'project:view', scope: 'team' },
    { role: 'manager', perm: 'task:view', scope: 'team' },
    { role: 'manager', perm: 'task:assign', scope: 'team' },
    { role: 'manager', perm: 'task:update_status', scope: 'team' },
    { role: 'manager', perm: 'meeting:view', scope: 'team' },
    { role: 'manager', perm: 'note:create', scope: 'team' },
    { role: 'manager', perm: 'blocker:review', scope: 'team' },
    { role: 'manager', perm: 'analytics:view', scope: 'team' },
    // Developer
    { role: 'developer', perm: 'project:view', scope: 'own' },
    { role: 'developer', perm: 'task:view', scope: 'own' },
    { role: 'developer', perm: 'task:update_status', scope: 'own' },
    { role: 'developer', perm: 'meeting:view', scope: 'own' },
    { role: 'developer', perm: 'note:create', scope: 'own' },
    { role: 'developer', perm: 'analytics:view', scope: 'own' },
    // QA
    { role: 'qa', perm: 'project:view', scope: 'team' },
    { role: 'qa', perm: 'task:view', scope: 'team' },
    { role: 'qa', perm: 'task:update_status', scope: 'team' },
    { role: 'qa', perm: 'meeting:view', scope: 'own' },
    { role: 'qa', perm: 'note:create', scope: 'own' },
    // HR
    { role: 'hr', perm: 'org:view_health', scope: 'org' },
    { role: 'hr', perm: 'team:view', scope: 'org' },
    { role: 'hr', perm: 'analytics:view', scope: 'org' },
    { role: 'hr', perm: 'note:create', scope: 'own' },
  ];

  for (const rp of rolePerms) {
    const roleId = roleMap[rp.role]?.id;
    const permissionId = permMap[rp.perm]?.id;
    if (!roleId || !permissionId) continue;

    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      update: { scope: rp.scope },
      create: { roleId, permissionId, scope: rp.scope },
    });
  }

  // ─── Mock Organization (simulates Entra ID import) ──────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'cornerstone' },
    update: {},
    create: {
      name: 'Cornerstone Technologies',
      slug: 'cornerstone',
      domain: 'cornerstone.dev',
    },
  });

  // Departments
  const engDept = await prisma.department.upsert({
    where: {
      organizationId_name: { organizationId: org.id, name: 'Engineering' },
    },
    update: {},
    create: { organizationId: org.id, name: 'Engineering' },
  });

  const qaDept = await prisma.department.upsert({
    where: { organizationId_name: { organizationId: org.id, name: 'QA' } },
    update: {},
    create: { organizationId: org.id, name: 'QA' },
  });

  const hrDept = await prisma.department.upsert({
    where: { organizationId_name: { organizationId: org.id, name: 'HR' } },
    update: {},
    create: { organizationId: org.id, name: 'HR' },
  });

  // Users (password for all: "test123")
  const pw = await bcrypt.hash('test123', 12);

  const karthik = await prisma.user.upsert({
    where: { email: 'karthik@cornerstone.dev' },
    update: {},
    create: {
      name: 'Karthik',
      email: 'karthik@cornerstone.dev',
      passwordHash: pw,
      jobTitle: 'Engineering Manager',
      department: 'Engineering',
    },
  });

  const janani = await prisma.user.upsert({
    where: { email: 'janani@cornerstone.dev' },
    update: {},
    create: {
      name: 'Janani',
      email: 'janani@cornerstone.dev',
      passwordHash: pw,
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      managerId: karthik.id,
    },
  });

  const rahul = await prisma.user.upsert({
    where: { email: 'rahul@cornerstone.dev' },
    update: {},
    create: {
      name: 'Rahul',
      email: 'rahul@cornerstone.dev',
      passwordHash: pw,
      jobTitle: 'Senior Software Engineer',
      department: 'Engineering',
      managerId: karthik.id,
    },
  });

  const priya = await prisma.user.upsert({
    where: { email: 'priya@cornerstone.dev' },
    update: {},
    create: {
      name: 'Priya',
      email: 'priya@cornerstone.dev',
      passwordHash: pw,
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      managerId: karthik.id,
    },
  });

  const anand = await prisma.user.upsert({
    where: { email: 'anand@cornerstone.dev' },
    update: {},
    create: {
      name: 'Anand',
      email: 'anand@cornerstone.dev',
      passwordHash: pw,
      jobTitle: 'QA Engineer',
      department: 'QA',
    },
  });

  const meera = await prisma.user.upsert({
    where: { email: 'meera@cornerstone.dev' },
    update: {},
    create: {
      name: 'Meera',
      email: 'meera@cornerstone.dev',
      passwordHash: pw,
      jobTitle: 'HR Manager',
      department: 'HR',
    },
  });

  // Admin user (you)
  const admin = await prisma.user.upsert({
    where: { email: 'jr@gmail.com' },
    update: {},
    create: {
      name: 'Janani R',
      email: 'jr@gmail.com',
      passwordHash: pw,
      jobTitle: 'Founder',
    },
  });

  // ─── Memberships ────────────────────────────────────────────────────────
  const memberships = [
    { userId: admin.id, roleKey: 'admin', deptId: null },
    { userId: karthik.id, roleKey: 'manager', deptId: engDept.id },
    { userId: janani.id, roleKey: 'developer', deptId: engDept.id },
    { userId: rahul.id, roleKey: 'developer', deptId: engDept.id },
    { userId: priya.id, roleKey: 'developer', deptId: engDept.id },
    { userId: anand.id, roleKey: 'qa', deptId: qaDept.id },
    { userId: meera.id, roleKey: 'hr', deptId: hrDept.id },
  ];

  for (const m of memberships) {
    await prisma.membership.upsert({
      where: {
        userId_organizationId: { userId: m.userId, organizationId: org.id },
      },
      update: {},
      create: {
        userId: m.userId,
        organizationId: org.id,
        roleId: roleMap[m.roleKey].id,
        departmentId: m.deptId,
      },
    });
  }

  // ─── Teams ──────────────────────────────────────────────────────────────
  const backendTeam = await prisma.team.upsert({
    where: { organizationId_name: { organizationId: org.id, name: 'Backend' } },
    update: {},
    create: {
      organizationId: org.id,
      departmentId: engDept.id,
      managerId: karthik.id,
      name: 'Backend',
    },
  });

  for (const userId of [karthik.id, janani.id, rahul.id, priya.id]) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: backendTeam.id, userId } },
      update: {},
      create: { teamId: backendTeam.id, userId },
    });
  }

  // ─── Sample Project + Tasks ─────────────────────────────────────────────
  const project = await prisma.project.upsert({
    where: {
      sourceSystem_sourceId: { sourceSystem: 'zeva', sourceId: 'ZEVA-1' },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Zeva MVP',
      key: 'ZEVA',
      sourceSystem: 'zeva',
      sourceId: 'ZEVA-1',
    },
  });

  const tasks: {
    title: string;
    assigneeId: string;
    status: string;
    priority?: string;
  }[] = [
    { title: 'Set up NestJS backend', assigneeId: janani.id, status: 'done' },
    {
      title: 'Implement auth module',
      assigneeId: janani.id,
      status: 'in_progress',
    },
    { title: 'Design RBAC guard', assigneeId: rahul.id, status: 'in_progress' },
    { title: 'Build dashboard API', assigneeId: priya.id, status: 'todo' },
    { title: 'Write E2E tests', assigneeId: anand.id, status: 'todo' },
    {
      title: 'Integrate Entra ID',
      assigneeId: rahul.id,
      status: 'todo',
      priority: 'high',
    },
    {
      title: 'Implement voice assistant',
      assigneeId: janani.id,
      status: 'todo',
      priority: 'high',
    },
    { title: 'Connect Jira integration', assigneeId: priya.id, status: 'todo' },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: {
        organizationId: org.id,
        projectId: project.id,
        title: t.title,
        assigneeId: t.assigneeId,
        status: t.status,
        priority: t.priority ?? 'medium',
      },
    });
  }

  // ─── Sample Meeting ─────────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 30, 0, 0);

  const meetingEnd = new Date(tomorrow);
  meetingEnd.setHours(11, 30);

  await prisma.meeting.create({
    data: {
      organizationId: org.id,
      organizerId: karthik.id,
      title: 'Sprint Planning',
      startsAt: tomorrow,
      endsAt: meetingEnd,
      agenda: '1. Review last sprint\n2. Plan next sprint\n3. Discuss blockers',
    },
  });

  console.log('✅ Seed complete!');
  console.log(`   Organization: ${org.name} (${org.slug})`);
  console.log(`   Users: ${memberships.length}`);
  console.log(`   Roles: ${roles.length}`);
  console.log(`   Permissions: ${permissions.length}`);
  console.log(`   Tasks: ${tasks.length}`);
  console.log('');
  console.log('   Login credentials (any user): password = "test123"');
  console.log('   Admin: jr@gmail.com / test123');
  console.log('   Manager: karthik@cornerstone.dev / test123');
  console.log('   Developer: janani@cornerstone.dev / test123');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
