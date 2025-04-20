// src/pages/profile/create.tsx
import { useNavigate } from "react-router-dom";
import { useCreateProfile } from "../../features/profile/hooks/use-profiles";
import { ProfileFormValues } from "../../features/profile/types";
import { ROUTE_CONSTANTS } from "../../routes/route-constants";
import ProfileForm from "../../features/profile/components/profile-form";

const ProfileCreatePage = () => {
  const navigate = useNavigate();
  const createProfile = useCreateProfile();
  
  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      await createProfile.mutateAsync(data);
      console.log("HEHEHEEE");
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Profile</h1>
      
      <ProfileForm
        onSubmit={handleSubmit}
        isSubmitting={createProfile.isPending}
        onCancel={() => navigate(ROUTE_CONSTANTS.PROFILE)}
      />
    </div>
  );
};

export default ProfileCreatePage;