// src/server/routers/user-router.js
import { j, privateProcedure, publicProcedure } from '../lib/jstack.js';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const userRouter = j
  .router()
  .get('/me', privateProcedure, async ({ ctx }) => {
    try {
      const user = await db.query.accounts.findFirst({
        where: eq(accounts.id, ctx.user.id)
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        externalId: user.externalId,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user information');
    }
  })
  .get('/checkUsername/:username', publicProcedure, async ({ c }) => {
    try {
      const username = c.req.param('username');
      
      // Check if username exists
      const existingUser = await db.query.accounts.findFirst({
        where: eq(accounts.username, username)
      });

      return {
        available: !existingUser,
        username
      };
    } catch (error) {
      console.error('Error checking username:', error);
      throw new Error('Failed to check username availability');
    }
  });