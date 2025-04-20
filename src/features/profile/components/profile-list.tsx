// src/features/profile/components/profile-list.tsx
import { useNavigate } from "react-router-dom";
import { Profile } from "../types";
import { ROUTE_CONSTANTS } from "../../../routes/route-constants";

interface ProfileListProps {
  profiles: Profile[];
  isLoading: boolean;
}

const ProfileList = ({ profiles, isLoading }: ProfileListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">You don't have any profiles yet.</p>
        <button
          onClick={() => navigate(ROUTE_CONSTANTS.PROFILE_CREATE)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Your First Profile
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition"
          onClick={() => navigate(`${ROUTE_CONSTANTS.PROFILE_EDIT}/${profile.id}`)}
        >
          <h2 className="text-xl font-semibold">
            {profile.firstname} {profile.lastname}
          </h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-gray-600">
            {profile.city}, {profile.country}
          </p>
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Jobs: {profile.jobs.length}
            </div>
            <div className="text-sm text-gray-500">
              Education: {profile.educations.length}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileList;