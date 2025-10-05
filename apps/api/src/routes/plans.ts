import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireRole } from './rbac';

const prisma = new PrismaClient();

export function registerPlans(app: FastifyInstance) {
  app.post('/plans', { preHandler: [app.authenticate as any, requireRole(app, ['clinician','admin']) as any] }, async (req: any) => {
    const body = z
      .object({
        patientId: z.string(),
        startDate: z.string(),
        templateName: z.string().optional(),
        days: z.array(z.any())
      })
      .parse(req.body);
    const plan = await prisma.plan.create({ data: { ...body, startDate: new Date(body.startDate) } });
    return { plan };
  });

  app.get('/plans/:id', { preHandler: [app.authenticate as any] }, async (req: any) => {
    const params = z.object({ id: z.string() }).parse(req.params);
    const plan = await prisma.plan.findUnique({ where: { id: params.id } });
    return { plan };
  });
}
