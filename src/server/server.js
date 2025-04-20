// src/server/server.js
import { serve } from '@hono/node-server';
import { createServer } from 'node:http';
import appRouter from './index.js';
import 'dotenv/config';

const port = process.env.PORT || 3000;
const server = createServer();

serve({
  fetch: appRouter.fetch,
  server,
  port,
});

console.log(`Server running at http://localhost:${port}`);