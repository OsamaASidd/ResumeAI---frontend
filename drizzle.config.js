// drizzle.config.js
import 'dotenv/config';

/** @type { import("drizzle-kit").Config } */
export default {
  schema: './src/server/db/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};