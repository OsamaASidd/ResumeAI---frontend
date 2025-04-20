// drizzle.config.js
import 'dotenv/config';

/** @type { import("drizzle-kit").Config } */
export default {
  schema: './src/server/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
//   driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
//   verbose: true,
//   strict: true,
};