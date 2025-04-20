// src/features/profile/schemas.ts
import { z } from "zod";

export const jobSchema = z.object({
  id: z.number().optional(), 
  jobTitle: z
    .string()
    .min(3, { message: "Job title must be at least 3 characters" }),
  employer: z
    .string()
    .min(3, { message: "Employer must be at least 3 characters" }),
  description: z.string().optional(),
  startDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Start date should be in the format YYYY-MM-DD",
  }),
  endDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "End date should be in the format YYYY-MM-DD",
  }),
  city: z.string().min(1, { message: "Please select a city" }),
});

export const educationSchema = z.object({
  id: z.number().optional(),
  school: z
    .string()
    .min(3, { message: "School name must be at least 3 characters" }),
  degree: z
    .string()
    .min(3, { message: "Degree name must be at least 3 characters" }),
  field: z
    .string()
    .min(3, { message: "Field name must be at least 3 characters" }),
  description: z.string().optional(),
  startDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Start date should be in the format YYYY-MM-DD",
  }),
  endDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "End date should be in the format YYYY-MM-DD",
  }),
  city: z.string().min(1, { message: "Please select a city" }),
});

export const profileSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastname: z
    .string()
    .min(1, { message: "Last name must be at least 1 character" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contactno: z.string().refine((val) => /^\d{10}$/.test(val), {
    message: "Contact number must be 10 digits",
  }),
  country: z.string().min(1, { message: "Please select a country" }),
  city: z.string().min(1, { message: "Please select a city" }),
  jobs: z.array(jobSchema),
  educations: z.array(educationSchema),
});