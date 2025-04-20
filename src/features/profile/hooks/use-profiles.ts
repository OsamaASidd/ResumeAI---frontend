// src/features/profile/hooks/use-profiles.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../../../api/endpoints/profile";
import { ProfileFormValues } from "../types";

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: profileApi.getProfiles,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.createProfile,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; formData: ProfileFormValues }) => 
      profileApi.updateProfile(data.id, data.formData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};