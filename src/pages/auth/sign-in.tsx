// src/pages/auth/sign-in.tsx
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn signInUrl="/sign-in" afterSignInUrl="/welcome" />
    </div>
  );
};

export default SignInPage;