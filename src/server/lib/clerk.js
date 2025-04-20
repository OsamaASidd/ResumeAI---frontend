// src/server/lib/clerk.js
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '../db';
import { accounts } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Syncs a Clerk user with our database
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object>} Database user record
 */
export const syncUserWithDatabase = async (userId) => {
  try {
    // Check if user already exists in database
    const existingUser = await db.query.accounts.findFirst({
      where: eq(accounts.externalId, userId)
    });

    if (existingUser) {
      return existingUser;
    }

    // If not, fetch user from Clerk and create in database
    const clerkUser = await clerkClient.users.getUser(userId);
    
    if (!clerkUser) {
      throw new Error('User not found in Clerk');
    }

    const primaryEmail = clerkUser.emailAddresses.find(
      email => email.id === clerkUser.primaryEmailAddressId
    );

    if (!primaryEmail) {
      throw new Error('User has no primary email');
    }

    // Create user in database
    const [newUser] = await db
      .insert(accounts)
      .values({
        externalId: clerkUser.id,
        email: primaryEmail.emailAddress,
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error('Error syncing user with database:', error);
    throw error;
  }
};

/**
 * Gets the current user from the database
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object>} Database user record
 */
export const getCurrentUser = async (userId) => {
  if (!userId) return null;

  try {
    // Try to find user in database
    const dbUser = await db.query.accounts.findFirst({
      where: eq(accounts.externalId, userId)
    });

    // If not found, sync with Clerk and create
    if (!dbUser) {
      return await syncUserWithDatabase(userId);
    }

    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};