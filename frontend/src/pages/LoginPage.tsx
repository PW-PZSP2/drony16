import { LoginForm } from "../components/feature/auth/LoginForm";
import { useSearchParams } from "react-router-dom";
import { RegisterForm } from "../components/feature/auth/RegisterForm";
import { Roles } from "@/types/auth/user_role";

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get("action") === "login";
  const roleParam = searchParams.get("role");

  // Normalize role param to match what RegisterForm expects
  const defaultRole =
    roleParam === "operator"
      ? Roles.OPERATOR
      : roleParam === "client"
        ? Roles.CLIENT
        : Roles.CLIENT;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 -translate-y-12">
      <div className="flex w-full max-w-md flex-col">
        <a href="/" className="flex items-center justify-center -mb-15">
          <img
            src="/images/logo.png"
            alt="Droneo"
            className="h-48 object-contain translate-x-2"
          />
        </a>
        <div className={isLogin ? "" : ""}>
          <div className="bg-background rounded-lg border p-6 shadow-sm">
            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm defaultRole={defaultRole} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
