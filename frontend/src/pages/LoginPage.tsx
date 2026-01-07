import { Drone } from "lucide-react";

import { LoginForm } from "../components/feature/auth/LoginForm";
import { useSearchParams } from "react-router-dom";
import { RegisterForm } from "../components/feature/auth/RegisterForm";

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get("action") === "login";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Drone className="size-4" />
          </div>
          Droneo
        </a>
        <div className={isLogin ? "" : ""}>
          <div className="bg-background rounded-lg border p-6 shadow-sm">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
