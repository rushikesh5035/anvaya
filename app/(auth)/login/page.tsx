import LoginUI from "@/module/auth/components/login-ui";
import { requireUnAuth } from "@/module/auth/lib/auth-utils";

const LoginPage = async () => {
  await requireUnAuth();

  return <LoginUI />;
};

export default LoginPage;
