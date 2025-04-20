// src/auth/clerk-provider.tsx
import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface ClerkProviderProps {
  children: ReactNode;
}

export const CustomClerkProvider = ({ children }: ClerkProviderProps) => {
  return (
    <ClerkProvider publishableKey={import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};