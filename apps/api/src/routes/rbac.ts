import { FastifyInstance } from 'fastify';

export function requireRole(app: FastifyInstance, roles: string[]) {
  return async function (req: any, reply: any) {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return reply.code(403).send({ error: 'forbidden' });
    }
  };
}
