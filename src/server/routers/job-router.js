// src/server/routers/job-router.js
import { z } from 'zod';
import { j, privateProcedure } from '../lib/jstack';
import { db } from '../db';
import { jobs, profiles } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const jobSchema = z.object({
  profileId: z.number(),
  jobTitle: z.string().min(3),
  employer: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().min(1),
});

export const jobRouter = j
  .router()
  .get('/getJobs/:profileId', privateProcedure, async ({ ctx, c }) => {
    try {
      const profileId = parseInt(c.req.param('profileId'), 10);
      
      // Check if profile belongs to the authenticated user
      const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq, and }) => 
          and(eq(profiles.id, profileId), eq(profiles.userId, ctx.user.id))
      });

      if (!profile) {
        return c.json({ error: 'Profile not found or unauthorized' }, 404);
      }

      const profileJobs = await db.query.jobs.findMany({
        where: eq(jobs.profileId, profileId),
      });

      return profileJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  })
  .post('/createJob', privateProcedure.input(jobSchema), async ({ ctx, input }) => {
    try {
      // Verify that the profile belongs to the authenticated user
      const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq, and }) => 
          and(eq(profiles.id, input.profileId), eq(profiles.userId, ctx.user.id))
      });

      if (!profile) {
        throw new Error('Profile not found or unauthorized');
      }

      const [newJob] = await db
        .insert(jobs)
        .values({
          profileId: input.profileId,
          jobTitle: input.jobTitle,
          employer: input.employer,
          description: input.description,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          city: input.city,
        })
        .returning();

      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  })
  .post('/updateJob', privateProcedure.input(
    z.object({
      id: z.number(),
      ...jobSchema.shape
    })
  ), async ({ ctx, input }) => {
    try {
      // First check if profile belongs to user
      const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq, and }) => 
          and(eq(profiles.id, input.profileId), eq(profiles.userId, ctx.user.id))
      });

      if (!profile) {
        throw new Error('Profile not found or unauthorized');
      }

      // Then check if job exists and belongs to the profile
      const existingJob = await db.query.jobs.findFirst({
        where: (jobs, { eq, and }) => 
          and(eq(jobs.id, input.id), eq(jobs.profileId, input.profileId))
      });

      if (!existingJob) {
        throw new Error('Job not found or does not belong to profile');
      }

      const [updatedJob] = await db
        .update(jobs)
        .set({
          jobTitle: input.jobTitle,
          employer: input.employer,
          description: input.description,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          city: input.city,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, input.id))
        .returning();

      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error('Failed to update job');
    }
  })
  .delete('/deleteJob/:id', privateProcedure, async ({ ctx, c }) => {
    try {
      const jobId = parseInt(c.req.param('id'), 10);
      
      // Find the job
      const jobToDelete = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId),
        with: {
          profile: true
        }
      });

      if (!jobToDelete) {
        return c.json({ error: 'Job not found' }, 404);
      }

      // Verify the job belongs to a profile owned by the authenticated user
      const isOwner = jobToDelete.profile.userId === ctx.user.id;
      
      if (!isOwner) {
        return c.json({ error: 'Unauthorized' }, 403);
      }

      await db.delete(jobs).where(eq(jobs.id, jobId));

      return { success: true, message: 'Job deleted successfully' };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw new Error('Failed to delete job');
    }
  });