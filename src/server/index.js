import { j } from './lib/jstack.js';
import { userRouter } from './routers/user-router.js';
import { jobRouter } from './routers/job-router.js';
import { resumeRouter } from './routers/resume-router.js';
import { authRouter } from './routers/auth-router.js';
import { profileRouter } from './routers/profile-router.js';

import { cors } from 'hono/cors';
const appCors = cors({
  origin: '*',  // or specify specific origin(s)
  allowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-is-superjson'],
  exposeHeaders: ['x-is-superjson'],
  credentials: true
});

const api = j
  .router()
  .basePath('/api')
  .use(cors({
    origin: '*',
    allowHeaders: ['*'],
    allowMethods: ['*'], 
    credentials: true
  }))
  .onError((error, c) => {
    console.error("HEHE Server error",error);
    return c.json(
      {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  });

  const appRouter = j.mergeRouters(api, {
    user: userRouter,
    job: jobRouter,
    auth: authRouter,
    profile: profileRouter,
    resume: resumeRouter
  });

export default appRouter;