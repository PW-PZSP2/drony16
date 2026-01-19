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
import { useState, useEffect } from "react";
import { AuthService } from "@/services/authorization_service";
import HorizontalRadio from "../../base/HorizontalRadio/HorizontalRadio";
import OperationStatus from "../../base/OperationStatus/OperationStatus";
import { Roles } from "@/types/auth/user_role";
import MapPreview from "@/components/base/MapPreview/MapPreview";

const registerSchema = z
  .object({
    role: z.string().min(1, "Rola jest wymagana"),
    username: z
      .string()
      .min(1, "Nazwa użytkownika jest wymagana.")
      .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki.")
      .max(20, "Nazwa użytkownika może mieć maksymalnie 20 znaków."),
    email: z
      .string()
      .min(1, "Email jest wymagany.")
      .email("Wprowadź prawidłowy adres email."),
    password: z
      .string()
      .min(1, "Hasło jest wymagane.")
      .min(6, "Hasło musi mieć co najmniej 6 znaków."),
    phone_number: z
      .string()
      .min(1, "Numer telefonu jest wymagany.")
      .min(9, "Numer telefonu musi mieć co najmniej 9 znaków."),
    localisation: z.string().optional(),
    area: z.string().optional(),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === Roles.OPERATOR) {
        return !!data.localisation && data.localisation.length > 0;
      }
      return true;
    },
    {
      message: "Lokalizacja jest wymagana dla operatora.",
      path: ["localisation"],
    },
  )
  .refine(
    (data) => {
      if (data.role === Roles.OPERATOR) {
        return !!data.area && data.area.length > 0;
      }
      return true;
    },
    {
      message: "Zasięg działania jest wymagany dla operatora.",
      path: ["area"],
    },
  );

interface RegisterFormProps extends React.ComponentProps<"form"> {
  defaultRole?: string;
}

export function RegisterForm({
  className,
  defaultRole = Roles.CLIENT,
  ...props
}: RegisterFormProps) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      username: "",
      email: "",
      password: "",
      phone_number: "",
      localisation: "",
      area: "",
      confirmPassword: "",
    },
  });

  const watchedRole = form.watch("role");

  // Update form default if prop changes
  useEffect(() => {
    if (defaultRole) {
      form.setValue("role", defaultRole);
    }
  }, [defaultRole, form]);

  const [formState, setFormState] = useState<
    "inProgress" | "success" | "error" | "loading"
  >("inProgress");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMap, setShowMap] = useState(false);

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setFormState("loading");
    setErrorMessage("");

    try {
      const user = await AuthService.register({
        user_name: data.username,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        localisation: data.localisation,
        area: data.area ? parseInt(data.area) : undefined,
        role: data.role,
      });

      if (user) {
        setFormState("success");
        setTimeout(() => {
          window.location.href = "?action=login";
        }, 3000);
      }
    } catch (error: any) {
      setFormState("error");
      setErrorMessage(error.message || "Wystąpił nieoczekiwany błąd");
      setTimeout(() => {
        setFormState("inProgress");
      }, 3000);
      console.error("Registration error:", error);
    }
  }

  return (
    <>
      {formState === "loading" && (
        <OperationStatus
          id="register-operation-status"
          status={formState}
          textPrimary="Trwa tworzenie konta"
          textSecondary="Proszę czekać..."
        />
      )}
      {formState === "success" && (
        <OperationStatus
          id="register-operation-status"
          status={formState}
          textPrimary="Konto utworzone pomyślnie!"
          textSecondary="Zaraz zostaniesz przekierowany na stronę logowania"
        />
      )}
      {formState === "error" && (
        <OperationStatus
          id="register-operation-status"
          status={formState}
          textPrimary="Błąd rejestracji"
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
              <h1 className="text-2xl font-bold">Utwórz konto</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Wypełnij poniższe pola, aby utworzyć nowe konto
              </p>
            </div>

            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <HorizontalRadio
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Operator", value: Roles.OPERATOR },
                    { label: "Klient", value: Roles.CLIENT },
                  ]}
                />
              )}
            />

            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-username">
                    Nazwa użytkownika
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-username"
                    type="text"
                    placeholder="jan_kowalski"
                    aria-invalid={fieldState.invalid}
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
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
              name="phone_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-phone">
                    Numer telefonu
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-phone"
                    type="tel"
                    placeholder="123456789"
                    aria-invalid={fieldState.invalid}
                    autoComplete="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {watchedRole === Roles.OPERATOR && (
              <>
                <Controller
                  name="localisation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-localisation">
                        Lokalizacja
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          id="register-localisation"
                          type="text"
                          placeholder="Warszawa, Polska"
                          aria-invalid={fieldState.invalid}
                          autoComplete="address-level2"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setShowMap(!showMap)}
                          title={showMap ? "Ukryj mapę" : "Pokaż na mapie"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                            <line x1="9" x2="9" y1="3" y2="18" />
                            <line x1="15" x2="15" y1="6" y2="21" />
                          </svg>
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {showMap && (
                  <div className="mb-4">
                    <MapPreview address={form.watch("localisation") || ""} />
                  </div>
                )}

                <Controller
                  name="area"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-area">
                        Zasięg działania (km)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="register-area"
                        type="number"
                        placeholder="50"
                        min="0"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </>
            )}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Hasło</FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
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
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-confirmPassword">
                    Potwierdź hasło
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-confirmPassword"
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
            <Field>
              <Button type="submit">Zarejestruj się</Button>
            </Field>
            <FieldDescription className="text-center">
              Masz już konto?{" "}
              <a href="?action=login" className="underline underline-offset-4">
                Zaloguj się
              </a>
            </FieldDescription>
          </FieldGroup>
        </form>
      )}
    </>
  );
}
