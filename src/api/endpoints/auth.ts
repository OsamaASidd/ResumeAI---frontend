// src/api/endpoints/auth.ts
import apiClient from "../client";

export const authApi = {
  getDatabaseSyncStatus: async () => {
    const response = await apiClient.get("/auth/getDatabaseSyncStatus");
    return response.data;
  }
};