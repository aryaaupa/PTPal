import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export function registerMessages(app: FastifyInstance) {
  app.get('/messages/:threadId', { preHandler: [app.authenticate as any] }, async (req) => {
    const params = z.object({ threadId: z.string() }).parse((req as any).params);
    const messages = await prisma.message.findMany({ where: { threadId: params.threadId } });
    return { messages };
  });

  app.post('/messages', { preHandler: [app.authenticate as any] }, async (req: any) => {
    const body = z
      .object({ threadId: z.string(), text: z.string().min(1) })
      .parse(req.body);
    const created = await prisma.message.create({
      data: { ...body, senderId: req.user.sub }
    });
    return { message: created };
  });
}
