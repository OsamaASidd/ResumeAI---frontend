// src/server/routers/profile-router.js
import { z } from 'zod';
import { j, privateProcedure } from '../lib/jstack.js';
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
  contactno: z.string().regex(/^\d{10}$/),
  country: z.string().min(1),
  city: z.string().min(1),
  jobs: z.array(jobSchema),
  educations: z.array(educationSchema),
});

export const profileRouter = j
  .router()
  .get('/getProfiles', privateProcedure, async ({ ctx }) => {
    try {
      const userProfiles = await db.query.profiles.findMany({
        where: eq(profiles.userId, ctx.user.id),
        with: {
          jobs: true,
          educations: true,
        },
      });

      return userProfiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  })
  .post('/createProfile', privateProcedure.input(profileSchema), async ({ ctx, input }) => {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Create the profile with a UUID
        const profileId = randomUUID();
        
        const [newProfile] = await tx
          .insert(profiles)
          .values({
            id: profileId,
            userId: ctx.user.id,
            firstname: input.firstname,
            lastname: input.lastname,
            email: input.email,
            contactno: input.contactno,
            country: input.country,
            city: input.city,
          })
          .returning();

        // Create jobs
        if (input.jobs.length > 0) {
          await tx.insert(jobs).values(
            input.jobs.map((job) => ({
              profileId: newProfile.id,
              jobTitle: job.jobTitle,
              employer: job.employer,
              description: job.description,
              startDate: job.startDate,
              endDate: job.endDate,
              city: job.city,
            }))
          );
        }

        // Create educations
        if (input.educations.length > 0) {
          await tx.insert(educations).values(
            input.educations.map((education) => ({
              profileId: newProfile.id,
              school: education.school,
              degree: education.degree,
              field: education.field,
              description: education.description,
              startDate: education.startDate,
              endDate: education.endDate,
              city: education.city,
            }))
          );
        }

        // Return the created profile with relationships
        const profileWithRelations = await tx.query.profiles.findFirst({
          where: eq(profiles.id, newProfile.id),
          with: {
            jobs: true,
            educations: true,
          },
        });

        return profileWithRelations;
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create profile');
    }
  })
  .post('/updateProfile', privateProcedure.input(
    z.object({
      id: z.string(),
      ...profileSchema.shape
    })
  ), async ({ ctx, input }) => {
    try {
      // Check if profile exists and belongs to user
      const existingProfile = await db.query.profiles.findFirst({
        where: (profiles, { eq, and }) => 
          and(eq(profiles.id, input.id), eq(profiles.userId, ctx.user.id))
      });

      if (!existingProfile) {
        throw new Error('Profile not found or unauthorized');
      }

      return await db.transaction(async (tx) => {
        // Update profile
        await tx
          .update(profiles)
          .set({
            firstname: input.firstname,
            lastname: input.lastname,
            email: input.email,
            contactno: input.contactno,
            country: input.country,
            city: input.city,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, input.id));

        // Delete existing jobs and educations
        await tx.delete(jobs).where(eq(jobs.profileId, input.id));
        await tx.delete(educations).where(eq(educations.profileId, input.id));

        // Create new jobs
        if (input.jobs.length > 0) {
          await tx.insert(jobs).values(
            input.jobs.map((job) => ({
              profileId: input.id,
              jobTitle: job.jobTitle,
              employer: job.employer,
              description: job.description,
              startDate: job.startDate,
              endDate: job.endDate,
              city: job.city,
            }))
          );
        }

        // Create new educations
        if (input.educations.length > 0) {
          await tx.insert(educations).values(
            input.educations.map((education) => ({
              profileId: input.id,
              school: education.school,
              degree: education.degree,
              field: education.field,
              description: education.description,
              startDate: education.startDate,
              endDate: education.endDate,
              city: education.city,
            }))
          );
        }

        // Return the updated profile with relationships
        const updatedProfile = await tx.query.profiles.findFirst({
          where: eq(profiles.id, input.id),
          with: {
            jobs: true,
            educations: true,
          },
        });

        return updatedProfile;
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  });