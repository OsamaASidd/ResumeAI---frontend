// src/pages/auth/sign-up.tsx
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp signUpUrl="/sign-up" afterSignUpUrl="/welcome" />
    </div>
  );
};

export default SignUpPage;