// src/api/endpoints/profile.ts
import apiClient from "../client";
import { ProfileFormValues } from "../../features/profile/types";

export const profileApi = {
  getProfiles: async () => {
    const response = await apiClient.get("/profile/getProfiles");
    return response.data;
  },
  
  createProfile: async (data: ProfileFormValues) => {
    const response = await apiClient.post("/profile/createProfile", data);
    return response.data;
  },
  
  updateProfile: async (id: string, data: ProfileFormValues) => {
    const response = await apiClient.post("/profile/updateProfile", { id, ...data });
    return response.data;
  }
};