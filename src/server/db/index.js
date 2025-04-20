// src/server/db/index.js
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema';

// Create PostgreSQL connection pool
const pool =  new Pool({
  connectionString: process.env.DATABASE_URL
});

// Initialize drizzle with the connection and schema
export const db = drizzle(pool, {
  schema
});
