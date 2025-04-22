// src/server/routers/auth-router.js
import { j } from '../lib/jstack.js';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';
// import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';


// Create the router with the correct jstack structure
export const authRouter = j.router();

// Add the getDatabaseSyncStatus endpoint
authRouter.get('/getDatabaseSyncStatus', async (c) => {
  try {
    // Extract the authorization header
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        isSynced: false,
        message: 'Not authenticated'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // For debugging
    console.log('Processing auth token:', token.substring(0, 15) + '...');
    
    // We rely on the Clerk token containing the user ID
    // This is passed from the frontend where the Clerk SDK is used properly
    // useAuth(), useSession(), etc. provide the proper user context
    
    // The frontend should have validated this token already using Clerk SDK
    // Here we extract the basic info we need
    let userId, userEmail;
    
    try {
      // Basic JWT parsing to get user ID
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      // console.log('Payload HQHQHQ:', payload);
      
      userId = payload.sub; // Standard JWT claim for user ID
      userEmail = payload.email || 'user@example.com';
      
      console.log('Extracted user ID:', userId);
    } catch (error) {
      console.error('Error extracting user info from token:', error);
      return c.json({
        isSynced: false,
        message: 'Invalid authentication token'
      }, 401);
    }
    
    if (!userId) {
      return c.json({
        isSynced: false,
        message: 'Could not determine user ID'
      }, 400);
    }
    
    // Check if user exists in database
    console.log('Checking if user exists with externalId:', userId);
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.externalId, userId)
    });
    
    if (account) {
      console.log('User found in database, ID:', account.id);
      return c.json({
        isSynced: true,
        userId: account.id,
        account
      });
    } else {
      // Create new user
      console.log('Creating new user with externalId:', userId);
      const id = nanoid();
      
      const [newAccount] = await db
        .insert(accounts)
        .values({
          id,
          externalId: userId,
          email: userEmail
        })
        .returning();
      
      console.log('New user created with ID:', newAccount.id);
      return c.json({
        isSynced: true,
        userId: newAccount.id,
        account: newAccount
      });
    }
  } catch (error) {
    console.error('Error in getDatabaseSyncStatus:', error);
    return c.json({
      isSynced: false,
      message: 'Server error while checking user sync status',
      error: error.message
    }, 500);
  }
});

// Add the syncUser endpoint for explicit sync
authRouter.post('/syncUser', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ 
        success: false, 
        message: 'Not authenticated' 
      }, 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Extract user info from token
    let userId, userEmail;
    
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      
      userId = payload.sub;
      userEmail = payload.email || 'user@example.com';
    } catch (error) {
      console.error('Error extracting user info from token:', error);
      return c.json({
        success: false,
        message: 'Invalid authentication token'
      }, 401);
    }
    
    if (!userId) {
      return c.json({
        success: false,
        message: 'Could not determine user ID'
      }, 400);
    }
    
    // Check if user exists
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.externalId, userId)
    });
    
    if (account) {
      return c.json({
        success: true,
        isSynced: true,
        userId: account.id,
        account
      });
    } else {
      // Create new user
      const id = nanoid();
      
      const [newAccount] = await db
        .insert(accounts)
        .values({
          id,
          externalId: userId,
          email: userEmail
        })
        .returning();
      
      return c.json({
        success: true,
        isSynced: true,
        userId: newAccount.id,
        account: newAccount
      });
    }
  } catch (error) {
    console.error('Error in syncUser:', error);
    return c.json({
      success: false,
      message: 'Server error while syncing user',
      error: error.message
    }, 500);
  }
});

// Add the me endpoint
authRouter.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Not authenticated' }, 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Extract user ID from token
    let userId;
    
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      
      userId = payload.sub;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return c.json({ error: 'Invalid authentication token' }, 401);
    }
    
    if (!userId) {
      return c.json({ error: 'Could not determine user ID' }, 400);
    }
    
    // Get user from database
    const user = await db.query.accounts.findFirst({
      where: eq(accounts.externalId, userId)
    });
    
    if (!user) {
      return c.json({ error: 'User not found in database' }, 404);
    }
    
    return c.json({
      id: user.id,
      externalId: user.externalId,
      email: user.email
    });
  } catch (error) {
    console.error('Error in me endpoint:', error);
    return c.json({ error: 'Server error while fetching user data' }, 500);
  }
});