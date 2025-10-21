import fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import path from "path";
import routes from "./routes/index.js";
import { auth } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const server  = fastify({ logger: true });

const start = async () => {
  try {
    await server.register(fastifyCors, {
      origin: [process.env.FRONTEND_API || "http://localhost:5173"],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    });
    
    server.addHook("preHandler", async (request, reply) => {
      const publicRoutes = ["/api/login", "/api/logout", "/api/register"];

      if (publicRoutes.includes(request.url)) return;

      if (request.url.startsWith("/api")) {
        await auth(request, reply);
      }
    });
    
    await server.register(routes, { prefix: '/api' });

    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();

export default server;