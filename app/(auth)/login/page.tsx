import { Suspense } from "react";

import LoginUI from "@/module/auth/components/login-ui";
import { requireUnAuth } from "@/module/auth/lib/auth-utils";

const LoginContent = async () => {
  await requireUnAuth();

  return <LoginUI />;
};

const LoginPage = () => (
  <Suspense
    fallback={
      <div
        aria-label="Loading login"
        className="dark min-h-screen bg-black"
        role="status"
      />
    }
  >
    <LoginContent />
  </Suspense>
);

export default LoginPage;
