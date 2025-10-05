import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireRole } from './rbac';

const prisma = new PrismaClient();

export function registerAnalytics(app: FastifyInstance) {
  app.get('/analytics/overview', { preHandler: [app.authenticate as any, requireRole(app, ['clinician','admin']) as any] }, async () => {
    const [patientCount, sessionCount] = await Promise.all([
      prisma.patient.count(),
      prisma.session.count()
    ]);
    return { patientCount, sessionCount };
  });
}
