import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export function registerSessions(app: FastifyInstance) {
  app.post('/sessions', { preHandler: [app.authenticate as any] }, async (req: any) => {
    const body = z
      .object({
        planId: z.string(),
        date: z.string(),
        repsCompleted: z.number().int(),
        setsCompleted: z.number().int(),
        pain: z.number().int().min(0).max(10),
        notes: z.string().optional(),
        cvMetrics: z.any()
      })
      .parse(req.body);
    const created = await prisma.session.create({
      data: { ...body, date: new Date(body.date) }
    });
    return { session: created };
  });
}
