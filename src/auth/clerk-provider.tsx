// src/auth/clerk-provider.tsx
import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { CLERK_PUBLISHABLE_KEY } from "../config/env";
import { useNavigate } from "react-router-dom";

interface ClerkProviderProps {
  children: ReactNode;
}

export const CustomClerkProvider = ({ children }: ClerkProviderProps) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error("Missing CLERK_PUBLISHABLE_KEY environment variable");
    return <div>Error: Missing CLERK_PUBLISHABLE_KEY</div>;
  }
  
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      navigate={(to) => {
        // This is a workaround to access navigate in a non-component context
        window.location.href = to;
      }}
    >
      {children}
    </ClerkProvider>
  );
};