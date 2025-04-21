// src/server/routers/auth-router.js
import { j, privateProcedure, publicProcedure } from '../lib/jstack.js';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

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
      
      // First try to extract externalId (Clerk ID) from token claim
      let externalId = token;
      
      // Check if the user exists in the database by externalId
      const user = await db.query.accounts.findFirst({
        where: eq(accounts.externalId, externalId)
      });

      if (user) {
        return {
          isSynced: true,
          userId: user.id
        };
      } else {
        // User doesn't exist, create a new account entry
        try {
          // Generate a unique ID for the new user
          const id = randomUUID();
          
          // For demo purposes - in production, extract user email from verified token
          let email = 'user@example.com';
          
          // See if email is embedded in the token (simplified approach)
          if (token.includes('@')) {
            email = token.split(' ').find(part => part.includes('@')) || email;
          }
          
          // Insert new account into database
          const [newUser] = await db.insert(accounts).values({
            id,
            externalId: externalId, 
            email: email,
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