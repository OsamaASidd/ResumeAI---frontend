// src/server/routers/auth-router.js
import { j, privateProcedure, publicProcedure } from '../lib/jstack.js';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const authRouter = j
  .router()
  .get('/getDatabaseSyncStatus', publicProcedure, async ({ c }) => {
    try {
      // Extract the user ID from the authorization header
      const authHeader = c.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          isSynced: false,
          message: 'Not authenticated'
        };
      }
      
      const token = authHeader.split(' ')[1];
      
      // Check if the user exists in the database
      const user = await db.query.accounts.findFirst({
        where: eq(accounts.id, token)
      });

      if (user) {
        return {
          isSynced: true,
          userId: user.id
        };
      } else {
        // If there's an externalId claim in the token, we can create the user
        // This is a simplified approach - in a real app, you'd verify and decode the token
        try {
          // For demo purposes only - in production, extract user info from a verified token
          const [newUser] = await db.insert(accounts).values({
            externalId: token, // Using token as external ID for demo
            email: 'user@example.com', // In real app, extract from token
          }).returning();

          return {
            isSynced: true,
            userId: newUser.id,
            message: 'User was created successfully'
          };
        } catch (createError) {
          console.error('Error creating user:', createError);
          return {
            isSynced: false,
            message: 'Failed to create user in database'
          };
        }
      }
    } catch (error) {
      console.error('Error checking database sync status:', error);
      return {
        isSynced: false,
        message: 'Error checking database sync status'
      };
    }
  })
  .get('/me', privateProcedure, async ({ ctx }) => {
    try {
      // Return authenticated user information
      return {
        id: ctx.user.id,
        externalId: ctx.user.externalId,
        email: ctx.user.email,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user information');
    }
  });