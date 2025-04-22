// src/pages/auth/welcome.tsx
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/endpoints/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, useUser, useSession } from "@clerk/clerk-react";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isSignedIn, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if all Clerk resources are loaded
  const isClerkReady = isSignedIn && isUserLoaded && isSessionLoaded && !!session;

  // Get database sync status
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-database-sync-status"],
    queryFn: authApi.getDatabaseSyncStatus,
    // Set polling interval if not synced
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 2000;
    },
    // Only run this query if Clerk is ready
    enabled: isClerkReady,
    onError: (error: any) => {
      console.error("Error getting database sync status:", error);
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message);
    }
  });

  // Log user info when available (for debugging)
  useEffect(() => {
    if (isClerkReady) {
      console.log("Clerk User ID:", userId);
      console.log("Clerk User Email:", user?.primaryEmailAddress?.emailAddress);
    }
  }, [isClerkReady, userId, user]);

  // Effect to help with Clerk data availability timing
  useEffect(() => {
    if (isClerkReady && !data && retryCount < 5) {
      const timer = setTimeout(() => {
        console.log(`Retry attempt ${retryCount + 1} for database sync...`);
        refetch();
        setRetryCount(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClerkReady, data, refetch, retryCount]);

  // Redirect once synced
  useEffect(() => {
    if (data?.isSynced) {
      console.log('Database sync confirmed, redirecting to profile...');
      navigate("/profile");
    }
  }, [data, navigate]);

  // Handle retry button click
  const handleRetry = () => {
    setErrorMessage(null);
    refetch();
  };

  // Not loaded yet
  if (!isClerkReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4 h-16 w-16 animate-spin text-5xl text-blue-500">⟳</div>
          <h2 className="text-xl font-bold mb-2">Loading Account Data</h2>
          <p className="text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-bold mb-2">Account Sync Issue</h2>
          <p className="text-lg mb-4">We encountered an issue syncing your account.</p>
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 w-full text-left">
              <p className="text-sm text-red-800 font-mono overflow-auto">{errorMessage}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-3 w-full">
            <button 
              onClick={handleRetry} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Try Again
            </button>
            
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full"
            >
              Skip and Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading/Syncing state
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4 h-16 w-16 animate-spin text-5xl text-blue-500">⟳</div>
        <h2 className="text-xl font-bold mb-2">Setting Up Your Account</h2>
        <p className="text-lg mb-2">Syncing your account data, please wait...</p>
        <p className="text-sm text-gray-500">
          {data?.message || "We're connecting your account to our database"}
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(retryCount * 20, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;