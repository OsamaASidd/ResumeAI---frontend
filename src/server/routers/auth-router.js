// src/server/routers/auth-router.js
import { j, privateProcedure, publicProcedure } from '../lib/jstack';
import { db } from '../db';
import { accounts } from '../db/schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export const authRouter = j
  .router()
  .get('/getDatabaseSyncStatus', publicProcedure, async ({ c }) => {
    try {
      // Check if the user from Clerk exists
      const auth = await currentUser();
      
      if (!auth) {
        return {
          isSynced: false,
          message: 'Not authenticated with Clerk'
        };
      }

      // Check if the user exists in the database
      const user = await db.query.accounts.findFirst({
        where: eq(accounts.externalId, auth.id)
      });

      if (user) {
        return {
          isSynced: true,
          userId: user.id
        };
      } else {
        // User doesn't exist in database, create them
        try {
          const [newUser] = await db.insert(accounts).values({
            externalId: auth.id,
            email: auth.emailAddresses[0]?.emailAddress || '',
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