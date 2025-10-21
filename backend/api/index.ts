// api/index.ts
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import routes from '../routes/index.js'
import { auth } from '../middleware/auth.js';

const app = fastify({ logger: true });

await app.register(fastifyCors, {
  origin: [process.env.FRONTEND_API || 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.addHook('preHandler', async (request, reply) => {
  const publicRoutes = ['/api/login', '/api/logout', '/api/register'];
  if (publicRoutes.includes(request.url)) return;
  if (request.url.startsWith('/api')) await auth(request, reply);
});

await app.register(routes, { prefix: '/api' });
await app.ready();

export default async function handler(req: any, res: any) {
  app.server.emit('request', req, res);
}
