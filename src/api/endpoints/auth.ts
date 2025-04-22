// src/api/endpoints/auth.ts
import apiClient from "../client";

export const authApi = {
  getDatabaseSyncStatus: async () => {
    try {
      const response = await apiClient.get("/auth/getDatabaseSyncStatus");
      return response.data;
    } catch (error: any) {
      console.error("Error getting database sync status:", error);
      
      // Extract more detailed error information from the response if available
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
        
        // Pass along the detailed error message from the server
        throw {
          ...error,
          serverDetails: error.response.data
        };
      }
      
      throw error;
    }
  },
  
  getUserProfile: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      console.error("Error getting user profile:", error);
      
      // Extract more detailed error information
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
      }
      
      throw error;
    }
  },
  
  // Method to explicitly sync user with database
  syncUserWithDatabase: async () => {
    try {
      // Log that we're making the request
      console.log("Calling syncUser endpoint...");
      
      const response = await apiClient.post("/auth/syncUser");
      console.log("syncUser response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error syncing user with database:", error);
      
      // Extract more detailed error information
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
        
        // Pass along the detailed error message from the server
        throw {
          ...error,
          serverDetails: error.response.data
        };
      }
      
      throw error;
    }
  }
};