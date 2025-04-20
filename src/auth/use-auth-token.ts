// src/auth/use-auth-token.ts
import { useAuth, useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthToken } from "../api/client";

export const useAuthToken = () => {
  const { isSignedIn } = useAuth();
  const { session } = useSession();

  useEffect(() => {
    const syncAuthToken = async () => {
      if (isSignedIn && session) {
        const token = await session.getToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    };

    syncAuthToken();
  }, [isSignedIn, session]);
};