// src/server/lib/jstack.js
import { jstack } from 'jstack';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index.js';
import { accounts } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Safe function to decode JWT payload
const safeDecodeJwt = (token) => {
  try {
    // Split the token and get the payload part (second part)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Invalid JWT format, does not have 3 parts');
      return null;
    }
    
    // Decode the base64 payload
    const payload = Buffer.from(parts[1], 'base64').toString();
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Initialize jstack
export const j = jstack.init();

// Simple authentication middleware that allows requests to proceed
// even if authentication fails - useful for debugging
const authMiddleware = j.middleware(async ({ c, next }) => {
  try {
    console.log('Auth middleware running for:', c.req.method, c.req.url);
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
    console.log('Token found in auth header:', token.substring(0, 15) + '...');
    
    // Try to extract user ID from token
    let userId = null;
    const payload = safeDecodeJwt(token);

    console.log("Received Payload after auth token 2 : ",payload);
    
    if (payload) {
      // In Clerk tokens, the user ID is typically in the 'sub' claim
      userId = payload.sub;
      console.log('Extracted userId from token payload:', userId);
    } else {
      // Use token as fallback ID (not ideal)
      userId = token;
      console.log('Using token as userId fallback');
    }
    
    // Find user by token or other identifier
    try {
      let user;
      
      if (userId) {
        // Try to find by external ID first (Clerk user ID)
        user = await db.query.accounts.findFirst({
          where: eq(accounts.externalId, userId)
        });
        
        if (user) {
          console.log('User found by externalId:', user.id);
        } else {
          // Try to create user if not found (auto-provisioning)
          console.log('User not found, attempting auto-provision...');
          try {
            const id = crypto.randomUUID();
            // let email = 'user@example.com';
            
            // If we have email in payload
            if (payload && payload.emailAddresses[0].emailAddress) {
              let email = payload.emailAddresses[0].emailAddress;
            }
            
            const [newUser] = await db.insert(accounts).values({
              id,
              externalId: userId,
              email,
            }).returning();
            
            user = newUser;
            console.log('Auto-provisioned user:', user.id);
          } catch (provisionError) {
            console.error('Error auto-provisioning user:', provisionError);
          }
        }
      }
      
      if (user) {
        return next({ user });
      }
    } catch (dbError) {
      console.error('DB error in auth middleware:', dbError);
    }
    
    // If user not found, use dummy user instead of throwing error
    console.log('User not found or could not be created, using dummy user');
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