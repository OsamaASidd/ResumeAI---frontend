// src/api/endpoints/auth.ts
import apiClient from "../client";

export const authApi = {
  getDatabaseSyncStatus: async () => {
    try {
      const response = await apiClient.get("/auth/getDatabaseSyncStatus");
      return response.data;
    } catch (error) {
      console.error("Error getting database sync status:", error);
      throw error;
    }
  },
  
  getUserProfile: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },
  
  // New method to check auth state and sync user
  syncUserWithDatabase: async () => {
    try {
      const response = await apiClient.post("/auth/syncUser");
      return response.data;
    } catch (error) {
      console.error("Error syncing user with database:", error);
      throw error;
    }
  }
};