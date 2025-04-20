// src/server/db/schema.js
import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    jsonb,
    integer,
    index
  } from 'drizzle-orm/pg-core';
  import { relations } from 'drizzle-orm';
  
  // Accounts
  export const accounts = pgTable('accounts', {
    id: text('id').primaryKey().notNull(),
    externalId: text('external_id').unique().notNull(),
    email: text('email').notNull(),
    quotaLimit: integer('quota_limit').default(100).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });
  
  // Profiles
  export const profiles = pgTable('profiles', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull().references(() => accounts.id),
    firstname: text('firstname').notNull(),
    lastname: text('lastname').notNull(),
    email: text('email').notNull(),
    contactno: text('contact_no').notNull(),
    country: text('country').notNull(),
    city: text('city').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });
  
  // Jobs
  export const jobs = pgTable('jobs', {
    id: serial('id').primaryKey(),
    profileId: text('profile_id').notNull().references(() => profiles.id),
    jobTitle: text('job_title'),
    employer: text('employer'),
    description: text('description'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    city: text('city'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });
  
  // Educations
  export const educations = pgTable('educations', {
    id: serial('id').primaryKey(),
    profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    school: text('school'),
    degree: text('degree'),
    field: text('field'),
    description: text('description'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    city: text('city'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });
  
  // Resumes
  export const resumes = pgTable('resumes', {
    id: text('id').primaryKey().notNull(),
    profileId: text('profile_id').notNull().references(() => profiles.id),
    userId: text('user_id').notNull().references(() => accounts.id),
    jdJobTitle: text('jd_job_title').notNull(),
    employer: text('employer').notNull(),
    jdPostDetails: text('jd_post_details').notNull(),
    previewImageUrl: text('preview_image_url'),
    personalDetails: jsonb('personal_details'),
    jobs: jsonb('jobs').array(),
    education: jsonb('education').array(),
    skills: jsonb('skills').array(),
    tools: jsonb('tools').array(),
    languages: jsonb('languages').array(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });
  
  // Users
  export const users = pgTable('users', {
    id: text('id').primaryKey().notNull(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    address: text('address').notNull(),
    linkedin: text('linkedin').notNull(),
    github: text('github').notNull(),
    skills: text('skills').array().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });
  
  // Posts
  export const posts = pgTable(
    'posts',
    {
      id: serial('id').primaryKey(),
      name: text('name').notNull(),
      createdAt: timestamp('createdAt').defaultNow().notNull(),
      updatedAt: timestamp('updatedAt').defaultNow().notNull()
    },
    (table) => ({
      nameIdx: index('Post_name_idx').on(table.name)
    })
  );
  
  // Relations
  export const accountsRelations = relations(accounts, ({ many }) => ({
    profiles: many(profiles),
    resumes: many(resumes),
    users: many(users)
  }));
  
  export const profilesRelations = relations(profiles, ({ many }) => ({
    jobs: many(jobs),
    educations: many(educations)
  }));
  
  export const jobsRelations = relations(jobs, ({ one }) => ({
    profile: one(profiles, {
      fields: [jobs.profileId],
      references: [profiles.id]
    })
  }));
  
  export const educationsRelations = relations(educations, ({ one }) => ({
    profile: one(profiles, {
      fields: [educations.profileId],
      references: [profiles.id]
    })
  }));
  
  export const resumesRelations = relations(resumes, ({ one }) => ({
    profile: one(profiles, {
      fields: [resumes.profileId],
      references: [profiles.id]
    }),
    account: one(accounts, {
      fields: [resumes.userId],
      references: [accounts.id]
    })
  }));
  
  export const usersRelations = relations(users, ({ one }) => ({
    account: one(accounts, {
      fields: [users.accountId],
      references: [accounts.id]
    })
  }));
  