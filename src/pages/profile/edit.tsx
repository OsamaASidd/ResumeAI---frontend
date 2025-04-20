// src/pages/profile/edit.tsx
import { useProfiles, useUpdateProfile } from "../../features/profile/hooks/use-profiles";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_CONSTANTS } from "../../routes/route-constants";
import { ProfileFormValues } from "../../features/profile/types";
import ProfileForm from "../../features/profile/components/profile-form";
import { useMemo } from "react";

const ProfileEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const updateProfile = useUpdateProfile();
  
  const profile = useMemo(() => {
    if (!profiles || !id) return null;
    return profiles.find((p) => p.id?.toString() === id);
  }, [profiles, id]);
  

  const handleSubmit = async (data: ProfileFormValues) => {
    if (!id) return;
    
    try {
      await updateProfile.mutateAsync({ id, formData: data });
      navigate(ROUTE_CONSTANTS.PROFILE);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (profilesLoading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found</div>;

  const defaultValues = {
    firstname: profile.firstname,
    lastname: profile.lastname,
    email: profile.email,
    contactno: profile.contactno,
    country: profile.country,
    city: profile.city,
    jobs: profile.jobs,
    educations: profile.educations
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      <ProfileForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateProfile.isPending}
        onCancel={() => navigate(ROUTE_CONSTANTS.PROFILE)}
      />
    </div>
  );
};

export default ProfileEditPage;