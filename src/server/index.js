// src/server/index.js
import { j } from './lib/jstack.js';
import { userRouter } from './routers/user-router.js';
import { jobRouter } from './routers/job-router.js';
import { resumeRouter } from './routers/resume-router.js';
import { authRouter } from './routers/auth-router.js';
import { profileRouter } from './routers/profile-router.js';

// Create the main API router with CORS support
const api = j
  .router()
  .basePath('/api')
  .use(async (c, next) => {
    // CORS middleware
    c.res.headers.set('Access-Control-Allow-Origin', '*');
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-is-superjson');
    c.res.headers.set('Access-Control-Expose-Headers', 'x-is-superjson');
    c.res.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
      return c.text('', 204);
    }
    
    return await next();
  })
  .onError((error, c) => {
    console.error("Server error:", error);
    return c.json(
      {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  });

// Explicitly mount each router with its base path
api.route('/user', userRouter);
api.route('/job', jobRouter);
api.route('/auth', authRouter);
api.route('/profile', profileRouter);
api.route('/resume', resumeRouter);

export default api;