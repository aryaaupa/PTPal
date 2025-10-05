import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from './rbac';

const prisma = new PrismaClient();

export function registerPatients(app: FastifyInstance) {
  app.get('/patients', { preHandler: [app.authenticate as any, requireRole(app, ['clinician','admin']) as any] }, async () => {
    const patients = await prisma.patient.findMany({ include: { user: true } });
    return { patients };
  });

  app.get('/patients/:id', { preHandler: [app.authenticate as any] }, async (req) => {
    const params = z.object({ id: z.string() }).parse((req as any).params);
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: { plans: true, sessions: true, user: true }
    });
    return { patient };
  });
}
