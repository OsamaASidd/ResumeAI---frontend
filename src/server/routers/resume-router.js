// src/server/routers/resume-router.js
import { z } from 'zod';
import { j, privateProcedure } from '../lib/jstack.js';
import { db } from '../db/index.js'; 
import { jobs, profiles } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const resumeSchema = z.object({
  title: z.string().min(1),
  templateId: z.string().min(1),
  content: z.record(z.unknown()),
  isPublic: z.boolean().default(false),
});

export const resumeRouter = j
  .router()
  .get('/getResumes', privateProcedure, async ({ ctx }) => {
    try {
      const userResumes = await db.query.resumes.findMany({
        where: eq(resumes.userId, ctx.user.id),
      });

      return userResumes;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw new Error('Failed to fetch resumes');
    }
  })
  .get('/getResume/:id', privateProcedure, async ({ ctx, c }) => {
    try {
      const resumeId = parseInt(c.req.param('id'), 10);
      
      const resume = await db.query.resumes.findFirst({
        where: (resumes, { eq, and }) => 
          and(eq(resumes.id, resumeId), eq(resumes.userId, ctx.user.id))
      });

      if (!resume) {
        return c.json({ error: 'Resume not found' }, 404);
      }

      return resume;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw new Error('Failed to fetch resume');
    }
  })
  .post('/createResume', privateProcedure.input(resumeSchema), async ({ ctx, input }) => {
    try {
      const [newResume] = await db
        .insert(resumes)
        .values({
          userId: ctx.user.id,
          title: input.title,
          templateId: input.templateId,
          content: input.content,
          isPublic: input.isPublic,
        })
        .returning();

      return newResume;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw new Error('Failed to create resume');
    }
  })
  .post('/updateResume', privateProcedure.input(
    z.object({
      id: z.number(),
      ...resumeSchema.shape
    })
  ), async ({ ctx, input }) => {
    try {
      // Check if resume exists and belongs to user
      const existingResume = await db.query.resumes.findFirst({
        where: (resumes, { eq, and }) => 
          and(eq(resumes.id, input.id), eq(resumes.userId, ctx.user.id))
      });

      if (!existingResume) {
        throw new Error('Resume not found or unauthorized');
      }

      const [updatedResume] = await db
        .update(resumes)
        .set({
          title: input.title,
          templateId: input.templateId,
          content: input.content,
          isPublic: input.isPublic,
          updatedAt: new Date(),
        })
        .where(eq(resumes.id, input.id))
        .returning();

      return updatedResume;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw new Error('Failed to update resume');
    }
  })
  .delete('/deleteResume/:id', privateProcedure, async ({ ctx, c }) => {
    try {
      const resumeId = parseInt(c.req.param('id'), 10);
      
      // Check if resume exists and belongs to user
      const existingResume = await db.query.resumes.findFirst({
        where: (resumes, { eq, and }) => 
          and(eq(resumes.id, resumeId), eq(resumes.userId, ctx.user.id))
      });

      if (!existingResume) {
        return c.json({ error: 'Resume not found or unauthorized' }, 404);
      }

      await db
        .delete(resumes)
        .where(eq(resumes.id, resumeId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw new Error('Failed to delete resume');
    }
  });