// src/auth/use-auth-token.ts
import { useAuth, useSession } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { setAuthToken } from "../api/client";

export const useAuthToken = () => {
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const [isTokenSet, setIsTokenSet] = useState(false);

  useEffect(() => {
    const syncAuthToken = async () => {
      if (isSignedIn && session) {
        try {
          // Get token from Clerk session
          const token = await session.getToken();
          
          // Set the token in the API client
          setAuthToken(token);
          setIsTokenSet(true);
          
          console.log("Auth token set successfully");
        } catch (error) {
          console.error("Error getting auth token from Clerk:", error);
          setAuthToken(null);
          setIsTokenSet(false);
        }
      } else {
        // Clear token if not signed in
        setAuthToken(null);
        setIsTokenSet(false);
      }
    };

    syncAuthToken();
    
    // Set up periodic token refresh
    const refreshInterval = setInterval(syncAuthToken, 10 * 60 * 1000); // Refresh every 10 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [isSignedIn, session]);

  return { isTokenSet };
};