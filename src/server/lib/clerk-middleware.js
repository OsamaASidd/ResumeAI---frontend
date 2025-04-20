// src/server/lib/clerk-middleware.js
import { clerkClient } from '@clerk/nextjs/server';

/**
 * Middleware to add Clerk authentication to API routes
 * This can be used with frameworks other than Next.js
 */
export const clerkMiddleware = async (req, res, next) => {
  try {
    // Extract the session token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    
    const sessionToken = authHeader.split(' ')[1];
    
    // Verify the token with Clerk
    const session = await clerkClient.sessions.verifySession(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session' });
    }
    
    // Get the user information
    const user = await clerkClient.users.getUser(session.userId);
    
    // Add the authenticated user to the request object
    req.auth = {
      userId: user.id,
      sessionId: session.id,
      user
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};