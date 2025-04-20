// src/server/lib/jstack.js
import { jstack } from 'jstack';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Initialize jstack
export const j = jstack.init();

// Simple authentication middleware that allows requests to proceed
// even if authentication fails - useful for debugging
const authMiddleware = j.middleware(async ({ c, next }) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // If no auth header, still continue but set a dummy user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header, using dummy user');
      return next({ 
        user: { 
          id: 'dummy-user-id', 
          email: 'dummy@example.com' 
        } 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Find user by token or other identifier
    try {
      const user = await db.query.accounts.findFirst({
        where: eq(accounts.id, token)
      });
      
      if (user) {
        return next({ user });
      }
    } catch (dbError) {
      console.error('DB error in auth middleware:', dbError);
    }
    
    // If user not found, use dummy user instead of throwing error
    console.log('User not found, using dummy user');
    return next({ 
      user: { 
        id: 'dummy-user-id', 
        email: 'dummy@example.com' 
      } 
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Allow request to continue with dummy user for debugging
    return next({ 
      user: { 
        id: 'dummy-user-id', 
        email: 'dummy@example.com' 
      } 
    });
  }
});

// Export procedures for route definition
export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(authMiddleware);