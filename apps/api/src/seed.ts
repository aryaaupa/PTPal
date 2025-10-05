import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Badges
  const badges = [
    { code: 'streak_7', name: 'One Week Strong', description: 'Completed a 7-day streak' },
    { code: 'streak_30', name: 'Momentum Builder', description: 'Completed a 30-day streak' },
    { code: 'first_session', name: 'First Step', description: 'Completed first session' }
  ];
  await prisma.badge.createMany({ data: badges, skipDuplicates: true });

  // Protocols (ten common)
  const protocols = [
    'ankle_sprain_phase_1',
    'ankle_sprain_phase_2',
    'acl_phase_2',
    'rotator_cuff',
    'lumbar_stability',
    'patellofemoral_pain',
    'tennis_elbow',
    'shoulder_impingement',
    'plantar_fasciitis',
    'it_band_syndrome'
  ].map((code, i) => ({
    code,
    name: code.replaceAll('_', ' ').toUpperCase(),
    description: 'Protocol template',
    days: JSON.stringify(Array.from({ length: 7 }).map((_, d) => ({ dayIndex: d, items: [{ exerciseId: String(((i + d) % 30) + 1), sets: 3, reps: 10, tempo: '2-1-2', restSeconds: 60 }] })))
  }));
  // @ts-ignore prisma types available at runtime
  // Insert protocols if model exists
  try { await (prisma as any).protocol.createMany({ data: protocols, skipDuplicates: true }); } catch {}

  // Exercises (sample with placeholders)
  const ex = await prisma.exercise.createMany({
    data: Array.from({ length: 30 }).map((_, i) => ({
      title: `Exercise ${i + 1}`,
      mediaUrl: 'https://placehold.co/640x360',
      cues: JSON.stringify(['Stand tall', 'Breathe steady']),
      contraindications: JSON.stringify([]),
      tags: JSON.stringify(['mobility']),
      formRules: JSON.stringify([{ key: 'back_straight', threshold: 0.6 }])
    })),
    skipDuplicates: true
  });

  // Users and patient
  const user = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: { email: 'patient@example.com', name: 'Pat Ient', role: 'patient', provider: 'password' }
  });
  const patient = await prisma.patient.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      injury: 'Ankle sprain',
      side: 'right',
      baselinePain: 5,
      baselineMobility: 'moderate',
      goals: JSON.stringify(['Return to running'])
    }
  });

  // Plans (simple 7-day structure)
  const days = Array.from({ length: 7 }).map((_, dayIndex) => ({ dayIndex, items: [{ exerciseId: '1', sets: 3, reps: 10, tempo: '2-1-2', restSeconds: 60 }] }));
  await prisma.plan.create({
    data: {
      patientId: patient.id,
      startDate: new Date(),
      templateName: 'ankle_sprain_phase_1',
      days: JSON.stringify(days)
    }
  });

  console.log('Seeded');
}

main().finally(() => prisma.$disconnect());
