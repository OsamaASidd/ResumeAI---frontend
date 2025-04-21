// src/pages/auth/welcome.tsx
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/endpoints/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, useSession } from "@clerk/clerk-react";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isSignedIn, userId } = useAuth();
  const { session } = useSession();
  const [retryCount, setRetryCount] = useState(0);

  // Get database sync status
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-database-sync-status"],
    queryFn: authApi.getDatabaseSyncStatus,
    // Set polling interval if not synced
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 2000;
    },
    // Only run this query if the user is signed in
    enabled: !!isSignedIn && !!session
  });

  // Effect to help with Clerk token availability timing
  useEffect(() => {
    if (isSignedIn && session && !data && retryCount < 5) {
      const timer = setTimeout(() => {
        refetch();
        setRetryCount(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, session, data, refetch, retryCount]);

  // Redirect once synced
  useEffect(() => {
    if (data?.isSynced) {
      navigate("/profile");
    }
  }, [data, navigate]);

  // Handle error states
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <p className="text-lg mb-4">We encountered an issue syncing your account.</p>
          <p className="text-sm text-gray-500 mb-6">Error: {error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-4 h-8 w-8 animate-spin text-2xl">⟳</div>
        <p className="text-lg mb-2">Syncing your account data, please wait...</p>
        <p className="text-sm text-gray-500">
          {data?.message || "We're setting things up for you"}
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;