import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyWebsocket from '@fastify/websocket';
import { parseEnv } from '@vitalize/config';
import { registerAuth } from './routes/auth';
import { registerPatients } from './routes/patients';
import { registerPlans } from './routes/plans';
import { registerSessions } from './routes/sessions';
import { registerMessages } from './routes/messages';
import { registerAnalytics } from './routes/analytics';
import { registerRealtime } from './routes/realtime';

const env = parseEnv(process.env);

const app = Fastify({ logger: true });
app.register(fastifyCors, { origin: env.WEB_URL, credentials: true });
app.register(fastifyJwt, { secret: env.JWT_SECRET });
app.register(fastifyWebsocket);

app.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'unauthorized' });
  }
});

registerRealtime(app);
registerAuth(app);
registerPatients(app);
registerPlans(app);
registerSessions(app);
registerMessages(app);
registerAnalytics(app);

app.get('/health', async () => ({ ok: true }));

app.listen({ port: env.PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
