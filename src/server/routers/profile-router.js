// src/server/routers/profile-router.js
import { z } from 'zod';
import { j } from '../lib/jstack.js';
import { db } from '../db/index.js';
import { profiles, jobs, educations } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const jobSchema = z.object({
  jobTitle: z.string().min(3),
  employer: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().min(1),
});

const educationSchema = z.object({
  school: z.string().min(3),
  degree: z.string().min(3),
  field: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().min(1),
});

const profileSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(1),
  email: z.string().email(),
  contactno: z.string(),
  country: z.string().min(1),
  city: z.string().min(1),
  jobs: z.array(jobSchema),
  educations: z.array(educationSchema),
});

// Create the router
export const profileRouter = j.router();

profileRouter.get('/getProfiles', async (c) => {
  try {
    const userProfiles = await db.query.profiles.findMany({
      with: {
        jobs: true,
        educations: true
      }
    });

    return c.json(userProfiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return c.json({ error: 'Failed to fetch profiles' }, 500);
  }
});

profileRouter.post('/createProfile', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate input
    const validatedData = profileSchema.parse(body);
    
    return c.json({
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return c.json({ error: 'Failed to create profile' }, 500);
  }
});

profileRouter.post('/updateProfile', async (c) => {
  try {
    const body = await c.req.json();
    
    // Simple validation to make sure ID exists
    if (!body.id) {
      return c.json({ error: 'Missing profile ID' }, 400);
    }
    
    // Return mock successful response
    return c.json({
      id: body.id,
      ...body,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});