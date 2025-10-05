import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppConfig } from '@vitalize/config';

const prisma = new PrismaClient();

export function registerRoutes(app: FastifyInstance, env: AppConfig) {
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

  app.get('/exercises', async () => {
    const exercises = await prisma.exercise.findMany({ take: 100 });
    return { exercises };
  });

  app.post('/plans', { preHandler: [app.authenticate as any] }, async (req: any) => {
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

  app.get('/patients', { preHandler: [app.authenticate as any] }, async () => {
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
