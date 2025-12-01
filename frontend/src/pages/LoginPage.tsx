import { Drone } from "lucide-react";

import { LoginForm } from "../components/feature/auth/LoginForm";
import { useSearchParams } from "react-router-dom";
import { RegisterForm } from "../components/feature/auth/RegisterForm";

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get("action") === "login";

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Drone className="size-4" />
            </div>
            Droneo
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
