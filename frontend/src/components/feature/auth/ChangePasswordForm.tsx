import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import OperationStatus from "@/components/base/OperationStatus/OperationStatus";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktualne hasło jest wymagane."),
    newPassword: z
      .string()
      .min(1, "Nowe hasło jest wymagane.")
      .min(6, "Nowe hasło musi mieć co najmniej 6 znaków."),
    confirmNewPassword: z
      .string()
      .min(1, "Potwierdzenie nowego hasła jest wymagane."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Hasła nie są identyczne.",
    path: ["confirmNewPassword"],
  });

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [formState, setFormState] = useState<
    "inProgress" | "success" | "error" | "loading"
  >("inProgress");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    setFormState("loading");
    console.log("Zmiana hasła:", data);

    try {
      // TODO: Add endpoint for changing password in AuthService
      // const result = await AuthService.changePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });

      // Symulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = true; // result !== null;

      if (success) {
        setFormState("success");
        form.reset();
        setTimeout(() => {
          setFormState("inProgress");
        }, 3000);
      } else {
        setErrorMessage("Nieprawidłowe aktualne hasło");
        setFormState("error");
        setTimeout(() => {
          setFormState("inProgress");
        }, 3000);
      }
    } catch (error) {
      console.error("Błąd zmiany hasła:", error);
      setErrorMessage("Wystąpił błąd podczas zmiany hasła");
      setFormState("error");
      setTimeout(() => {
        setFormState("inProgress");
      }, 3000);
    }
  }

  return (
    <>
      {formState === "loading" && (
        <OperationStatus
          id="change-password-operation-status"
          status={formState}
          textPrimary="Trwa zmiana hasła"
          textSecondary="Proszę czekać..."
        />
      )}
      {formState === "success" && (
        <OperationStatus
          id="change-password-operation-status"
          status={formState}
          textPrimary="Hasło zostało zmienione"
          textSecondary="Twoje hasło zostało pomyślnie zaktualizowane"
        />
      )}
      {formState === "error" && (
        <OperationStatus
          id="change-password-operation-status"
          status={formState}
          textPrimary="Błąd zmiany hasła"
          textSecondary={errorMessage}
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
              <h1 className="text-2xl font-bold">Zmiana hasła</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Wprowadź aktualne hasło i nowe hasło
              </p>
            </div>

            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="current-password">
                    Aktualne hasło
                  </FieldLabel>
                  <Input
                    {...field}
                    id="current-password"
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

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-password">Nowe hasło</FieldLabel>
                  <Input
                    {...field}
                    id="new-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmNewPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-new-password">
                    Powtórz nowe hasło
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirm-new-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Zmień hasło
            </Button>
          </FieldGroup>
        </form>
      )}
    </>
  );
}
