// src/pages/profile/index.tsx
import { useNavigate } from "react-router-dom";
import { useProfiles } from "../../features/profile/hooks/use-profiles";
import { ROUTE_CONSTANTS } from "../../routes/route-constants";
import ProfileList from "../../features/profile/components/profile-list";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: profiles = [], isLoading, error } = useProfiles();

  if (error) return <div>Error loading profiles: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profiles</h1>
        <button
          onClick={() => navigate(ROUTE_CONSTANTS.PROFILE_CREATE)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Profile
        </button>
      </div>

      <ProfileList profiles={profiles} isLoading={isLoading} />
    </div>
  );
};

export default ProfilePage;