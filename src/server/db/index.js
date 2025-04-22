// src/server/db/index.js
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import 'dotenv/config';

const { Pool } = pg;

// Log connection attempt
console.log('Initializing database connection...');
console.log('Connection string exists:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set!");
} else {
  // Only log a sanitized version for security
  const sanitizedUrl = process.env.DATABASE_URL.replace(
    /postgresql:\/\/([^:]+):([^@]+)@/,
    'postgresql://$1:****@'
  );
  console.log('Using database URL:', sanitizedUrl);
}

// Create PostgreSQL connection pool with better error handling
let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add explicit connection timeout for faster failures
    connectionTimeoutMillis: 5000,
    // Add logging on idle errors
    on: 'error', 
    onError: (err) => {
      console.error('Database pool error:', err);
    }
  });
  
  // Test the connection
  pool.query('SELECT NOW()')
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error testing database connection:', err));
    
} catch (error) {
  console.error('Failed to create database pool:', error);
  // Create a dummy pool for development fallback
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using dummy database pool for development');
    pool = {
      query: () => Promise.resolve({ rows: [] }),
      on: () => {},
    };
  } else {
    throw error; // In production, fail hard
  }
}

// Initialize drizzle with the connection and schema
export const db = drizzle(pool, {
  schema
});