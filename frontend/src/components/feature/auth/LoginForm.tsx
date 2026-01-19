import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { AuthService } from "@/services/authorization_service";
import { useState } from "react";
import OperationStatus from "@/components/base/OperationStatus/OperationStatus";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany.")
    .email("Wprowadź prawidłowy adres email."),
  password: z
    .string()
    .min(1, "Hasło jest wymagane.")
    .min(6, "Hasło musi mieć co najmniej 6 znaków."),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [formState, setFormState] = useState<
    "inProgress" | "success" | "error" | "loading"
  >("inProgress");

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setFormState("loading");
    console.log("Login:", data);

    const credentials = {
      username: data.email,
      password: data.password,
    };

    const result = await AuthService.login(credentials);
    if (result) {
      setFormState("success");
      setTimeout(() => {
        if (result.roles.includes("adm")) {
          window.location.href = "/admin/dashboard";
        } else if (result.roles.includes("ope")) {
          window.location.href = "/operator/dashboard";
        } else if (result.roles.includes("cli")) {
          window.location.href = "/client/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1000);
      console.log("Zalogowano użytkownika:", result);
    } else {
      setFormState("error");
      setTimeout(() => {
        setFormState("inProgress");
      }, 2000);
      console.log("Błąd logowania");
    }
  }

  return (
    <>
      {formState === "loading" && (
        <OperationStatus
          id="login-operation-status"
          status={formState}
          textPrimary="Trwa logowanie"
          textSecondary="Daj nam jeszcze tylko sekundeczke.."
        />
      )}
      {formState === "success" && (
        <OperationStatus
          id="login-operation-status"
          status={formState}
          textPrimary="Zalogowano pomyślnie"
          textSecondary="Zaraz zostaniesz przekierowany na stronę główną"
        />
      )}
      {formState === "error" && (
        <OperationStatus
          id="login-operation-status"
          status={formState}
          textPrimary="Błąd podczas logowania"
          textSecondary="Sprawdź swoje dane i spróbuj ponownie"
        />
      )}
      {formState === "inProgress" && (
        <form
          {...props}
          className={cn("flex flex-col gap-6", className)}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Zaloguj się</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Wprowadź swój email, aby zalogować się do konta
              </p>
            </div>

            {formState === "inProgress" && (
              <>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        placeholder="jan@example.com"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="login-password">Hasło</FieldLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Zapomniałeś hasła?
                        </a>
                      </div>
                      <Input
                        {...field}
                        id="login-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Field>
                  <Button type="submit">Zaloguj się</Button>
                </Field>
                <Field>
                  <FieldDescription className="text-center">
                    Nie masz konta?{" "}
                    <a
                      href="?action=register"
                      className="underline underline-offset-4"
                    >
                      Zarejestruj się
                    </a>
                  </FieldDescription>
                </Field>
              </>
            )}
          </FieldGroup>
        </form>
      )}
    </>
  );
}
