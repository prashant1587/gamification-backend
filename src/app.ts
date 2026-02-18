import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import connect from './config/db';

import './models/screenshot';
import screenshotsRoutes from './routes/screenshots';

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1
    }
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Screenshots Backend API',
        version: '1.0.0'
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/api/docs'
  });

  await app.register(async (api) => {
    await screenshotsRoutes(api);
  }, { prefix: '/api' });

  return app;
}

async function start() {
  const port = Number(process.env.PORT || 4000);
  const host = process.env.HOST || '0.0.0.0';

  await connect();
  const app = await buildServer();
  await app.listen({ port, host });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
