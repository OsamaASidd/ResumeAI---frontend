import { jstack } from 'jstack';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index.js'; // ensure .js extension if you're in an ESM project
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const j = jstack.init(); // removed generic type <Env>

// Auth middleware for protected routes
const authMiddleware = j.middleware(async ({ c, next }) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Unauthorized: Missing or invalid token' });
    }
    
    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      throw new HTTPException(401, { message: 'Unauthorized: Missing token' });
    }
    
    // Find user by token or other identifier
    const user = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.id, token)
    });
    
    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized: Invalid token' });
    }

    return next({ user });
  } catch (error) {
    console.error('Auth middleware error:', error);
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
});

export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(authMiddleware);
