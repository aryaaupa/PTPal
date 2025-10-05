import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export function registerAuth(app: FastifyInstance) {
  app.post('/auth/register', async (req, reply) => {
    const body = z
      .object({ name: z.string(), email: z.string().email(), password: z.string().min(8) })
      .parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return reply.code(400).send({ error: 'email_in_use' });
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, role: 'patient', provider: 'password' }
    });
    const token = app.jwt.sign({ sub: user.id, role: user.role });
    return { token };
  });

  app.post('/auth/login', async (req, reply) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return reply.code(401).send({ error: 'invalid_credentials' });
    const token = app.jwt.sign({ sub: user.id, role: user.role });
    return { token };
  });

  app.get('/me', { preHandler: [app.authenticate as any] }, async (req: any) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    return { user };
  });
}
