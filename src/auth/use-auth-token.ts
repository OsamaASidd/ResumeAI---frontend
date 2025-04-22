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
          const token = await session.getToken({
            template: "ResumeAi"
          });

          console.log("clerk signin AAA",isSignedIn);
          console.log("clerk session BBB",session);
          
                    
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
        
        if (session === null && isSignedIn === false) {
          console.log("User is signed out - cleared auth token");
        } else if (!session && isSignedIn !== false) {
          console.log("Auth session not yet loaded");
        }
      }
    };

    syncAuthToken();
    
    const refreshInterval = setInterval(syncAuthToken, 5 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [isSignedIn, session]);

  return { isTokenSet };
};